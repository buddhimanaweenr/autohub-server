import Joi from '@hapi/joi'
import validate from '../util/common/validations'
import rs from '../util/common/response'
import isEmpty from '../util/common/isEmpty'
import Moment from 'moment';
const User = require('../models/User');
import bcrypt from 'bcryptjs';
import mongodb from "mongodb";

exports.getAll = async (req, res, next) => {
    
    const filter =  [
        {
            "$match": {
                //'isActive': true
            }
        }
    ]

    let mappingsArray = await User.fetchAll(filter);

    res.status(200).json({
        message:"List of All Users..",
        status:"Success",
        results: mappingsArray,
    });
}

exports.getById = async (req, res, next) => {

    var id =  req.params.id;

    const validateSchema = Joi.object({
        id: Joi.string().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Missing ID", error));

    let result = await User.findById(id);

    res.status(200).json({
        message:`User By ID ${req.params.id}`,
        status:"Success",
        result: result
    });
}

exports.create = async (req, res, next) => {

    var data = req.body;

    const validateSchema = Joi.object({
        fullName: Joi.string().allow(''),
        userName: Joi.string().required(),
        userEmail: Joi.string().allow(''),
        password: Joi.string().required(),
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Missing ID", error));

    const user = await User.findByUserName(req.body.userName);

    if (user) return res.status(200).json({message: "Username already used"});

    var dataObj = {
        fullName: !isEmpty(data.fullName) ? data.fullName : '',
        userName: !isEmpty(data.userName) ? data.userName : '',
        userEmail: !isEmpty(data.userEmail) ? data.userEmail : '',
        password: !isEmpty(data.password) ? bcrypt.hashSync(data.password) : ''
    }

    let result = await User.save(dataObj);

    res.status(200).json({
        message: "Registration Succesfully",
        status: "Success",
        result: result
    });
};

exports.updateById = async (req, res, next) => {

    let data = req.body;

    const validateSchema = Joi.object({
        _id: Joi.string().required(),
        fullName: Joi.string().allow(''),
        userName: Joi.string().allow(''),
        userEmail: Joi.string().allow(''),
        password: Joi.string().allow(''),
        isActive: Joi.bool().allow()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Missing ID", error));

    if(!isEmpty(data.password)) {
        data.password = bcrypt.hashSync(data.password)
    }

    let result = await User.save(data);

    res.status(200).json({
        message:`User Details Updated by ID ${mongodb.ObjectId(data._id)}`,
        status:"Success",
        result: result
    });

}

exports.deleteById = async (req, res, next) => {

    var id =  req.params.id;

    const validateSchema = Joi.object({
        id: Joi.string().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Missing ID", error));

    let result = await User.deleteById(id);

    res.status(200).json({
        message:`User Deleted by ID ${req.params.id}`,
        status:"Success",
        result: result
    });

}