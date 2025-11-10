import Joi from '@hapi/joi'
import validate from '../util/common/validations'
import rs from '../util/common/response'
import isEmpty from '../util/common/isEmpty'
import Moment from 'moment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import mongodb from "mongodb";
const User = require('../models/User');

exports.login = async (req, res, next) => {
    const validateSchema = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    })

    const error = validate(validateSchema, req.body)

    if (error) return res.status(400).send(rs.error("Missing username or password", error));

    try {

        const user = await User.findByUserName(req.body.userName);

        if (!user) return res.status(400).send(rs.error('Account not found'))

        const userIsActive = user.isActive;

        if (!userIsActive) return res.status(400).send(rs.error('This email is currently inactive'))

        const validPass = await bcrypt.compare(req.body.password, user.password)

        if (!validPass) return res.status(400).send(rs.error('Incorrect Email or Password'))

        //create jwt 
        const userBindData = { _id: user._id, fullName: user.fullName, userName: user.userName, userEmail: user.userEmail }

        const token = jwt.sign(userBindData, process.env.JWT_SECRET, { expiresIn: '43200s' })
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        userBindData.exp = verified.exp;
        
        return res.status(200).json({
            message: `Auth Login`,
            status: "Success",
            results: {
                accessToken: token,
                user: userBindData
            }
        });

    } catch (e) {

        return res.status(401).json({
            message: `Invalid Login`,
            status: "error",
        });

    }

};

exports.verifyToken = async (req, res, next) => {

    const token = req.body.token

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = {
            isTokenValid: true,
            user: verified
        }

        return res.status(200).send(user)

    } catch (e) {

        return res.status(401).send(rs.error('Invalid Token'))

    }


};  