import Joi from '@hapi/joi'
import validate from '../util/common/validations'
import rs from '../util/common/response'
import isEmpty from '../util/common/isEmpty'
import Moment from 'moment';
const VehicleInspection = require('../models/VehicleInspection');
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

    let mappingsArray = await VehicleInspection.fetchAll(filter);

    res.status(200).json({
        message:"List of All Vehicle Inspections..",
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

    let result = await VehicleInspection.findById(id);

    res.status(200).json({
        message:`Vehicle Inspection By ID ${req.params.id}`,
        status:"Success",
        result: result
    });
}

exports.create = async (req, res, next) => {

    var data = req.body;

    const validateSchema = Joi.object({
        // Vehicle Details
        vehicleId: Joi.string().required(),
        preferredDate: Joi.string().required(),
        preferredTime: Joi.string().required(),
        
        // Contact Information
        fullName: Joi.string().required(),
        emailAddress: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        
        // Inspection Details
        inspectionLocation: Joi.string().required(),
        inspectionType: Joi.string().required(),
        specialRequests: Joi.string().allow('').optional()
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
        preferredDate: !isEmpty(data.preferredDate) ? data.preferredDate : '',
        preferredTime: !isEmpty(data.preferredTime) ? data.preferredTime : '',
        fullName: !isEmpty(data.fullName) ? data.fullName : '',
        emailAddress: !isEmpty(data.emailAddress) ? data.emailAddress : '',
        phoneNumber: !isEmpty(data.phoneNumber) ? data.phoneNumber : '',
        inspectionLocation: !isEmpty(data.inspectionLocation) ? data.inspectionLocation : '',
        inspectionType: !isEmpty(data.inspectionType) ? data.inspectionType : '',
        specialRequests: !isEmpty(data.specialRequests) ? data.specialRequests : '',
        status: 'pending'
    }

    let result = await VehicleInspection.save(dataObj);

    res.status(200).json({
        message: "Vehicle Inspection Booked Successfully",
        status: "Success",
        result: result
    });
};

exports.updateById = async (req, res, next) => {

    let data = req.body;

    const validateSchema = Joi.object({
        _id: Joi.string().required(),
        vehicleId: Joi.string().allow(''),
        preferredDate: Joi.string().allow(''),
        preferredTime: Joi.string().allow(''),
        fullName: Joi.string().allow(''),
        emailAddress: Joi.string().email().allow(''),
        phoneNumber: Joi.string().allow(''),
        inspectionLocation: Joi.string().allow(''),
        inspectionType: Joi.string().allow(''),
        specialRequests: Joi.string().allow(''),
        status: Joi.string().allow(''),
        isActive: Joi.bool().allow()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Validation Error", error));

    let result = await VehicleInspection.save(data);

    res.status(200).json({
        message:`Vehicle Inspection Updated by ID ${mongodb.ObjectId(data._id)}`,
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

    let result = await VehicleInspection.deleteById(id);

    res.status(200).json({
        message:`Vehicle Inspection Deleted by ID ${req.params.id}`,
        status:"Success",
        result: result
    });

}

// Get inspections by vehicle ID
exports.getByVehicleId = async (req, res, next) => {

    var vehicleId =  req.params.vehicleId;

    const validateSchema = Joi.object({
        vehicleId: Joi.string().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Missing Vehicle ID", error));

    let result = await VehicleInspection.findByVehicleId(vehicleId);

    res.status(200).json({
        message:`Vehicle Inspections for Vehicle ID ${req.params.vehicleId}`,
        status:"Success",
        results: result
    });
}

// Get inspections by email
exports.getByEmail = async (req, res, next) => {

    var emailAddress =  req.params.email;

    const validateSchema = Joi.object({
        email: Joi.string().email().required(),
    })

    const error = validate(validateSchema, req.params)

    if (error) return res.status(400).send(rs.error("Invalid Email", error));

    let result = await VehicleInspection.findByEmail(emailAddress);

    res.status(200).json({
        message:`Vehicle Inspections for Email ${req.params.email}`,
        status:"Success",
        results: result
    });
}
