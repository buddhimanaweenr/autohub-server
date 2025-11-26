import Joi from '@hapi/joi'
import validate from '../util/common/validations'
import rs from '../util/common/response'
import isEmpty from '../util/common/isEmpty'
import Moment from 'moment';
const Quote = require('../models/Quote');
const Vehicle = require('../models/Vehicle');
import mongodb from "mongodb";

exports.getAll = async (req, res, next) => {
    
    const filter =  [
        {
            "$match": {
                'isActive': true
            }
        }
    ]

    let mappingsArray = await Quote.fetchAll(filter);

    res.status(200).json({
        message:"List of All Quotes..",
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

    let result = await Quote.findById(id);

    res.status(200).json({
        message:`Quote By ID ${req.params.id}`,
        status:"Success",
        result: result
    });
}

exports.create = async (req, res, next) => {

    var data = req.body;

    const validateSchema = Joi.object({
        // Vehicle Details
        vehicleId: Joi.string().required(),
        
        // Contact Information
        fullName: Joi.string().required(),
        emailAddress: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        whatsappNumber: Joi.string().allow('').optional(),
        remarks: Joi.string().allow('').optional()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Validation Error", error));

    // Validate that vehicle exists
    const vehicle = await Vehicle.findById(data.vehicleId);
    if (!vehicle) {
        return res.status(400).json({
            message: "Vehicle not found",
            status: "Error"
        });
    }

    var dataObj = {
        vehicleId: !isEmpty(data.vehicleId) ? data.vehicleId : '',
        fullName: !isEmpty(data.fullName) ? data.fullName : '',
        emailAddress: !isEmpty(data.emailAddress) ? data.emailAddress : '',
        phoneNumber: !isEmpty(data.phoneNumber) ? data.phoneNumber : '',
        whatsappNumber: !isEmpty(data.whatsappNumber) ? data.whatsappNumber : '',
        remarks: !isEmpty(data.remarks) ? data.remarks : ''
    }

    let result = await Quote.save(dataObj);

    res.status(200).json({
        message: "Quote Created Successfully",
        status: "Success",
        result: result
    });
};

exports.updateById = async (req, res, next) => {

    let data = req.body;

    const validateSchema = Joi.object({
        _id: Joi.string().required(),
        vehicleId: Joi.string().allow(''),
        fullName: Joi.string().allow(''),
        emailAddress: Joi.string().email().allow(''),
        phoneNumber: Joi.string().allow(''),
        whatsappNumber: Joi.string().allow(''),
        remarks: Joi.string().allow(''),
        isActive: Joi.bool().allow()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Validation Error", error));

    let result = await Quote.save(data);

    res.status(200).json({
        message:`Quote Updated by ID ${mongodb.ObjectId(data._id)}`,
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

    let result = await Quote.deleteById(id);

    res.status(200).json({
        message:`Quote Deleted by ID ${req.params.id}`,
        status:"Success",
        result: result
    });

}

// Get quotes by vehicle ID
exports.getByVehicleId = async (req, res, next) => {

    var vehicleId =  req.params.vehicleId;

    const validateSchema = Joi.object({
        vehicleId: Joi.string().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Missing Vehicle ID", error));

    let result = await Quote.findByVehicleId(vehicleId);

    res.status(200).json({
        message:`Quotes for Vehicle ID ${req.params.vehicleId}`,
        status:"Success",
        results: result
    });
}

// Get quotes by email
exports.getByEmail = async (req, res, next) => {

    var emailAddress =  req.params.email;

    const validateSchema = Joi.object({
        email: Joi.string().email().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Invalid Email", error));

    let result = await Quote.findByEmail(emailAddress);

    res.status(200).json({
        message:`Quotes for Email ${req.params.email}`,
        status:"Success",
        results: result
    });
}

