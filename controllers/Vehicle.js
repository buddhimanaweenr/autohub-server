import Joi from '@hapi/joi'
import validate from '../util/common/validations'
import rs from '../util/common/response'
import isEmpty from '../util/common/isEmpty'
import Moment from 'moment';
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

    let mappingsArray = await Vehicle.fetchAll(filter);

    res.status(200).json({
        message:"List of All Vehicles..",
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

    let result = await Vehicle.findById(id);

    res.status(200).json({
        message:`Vehicle By ID ${req.params.id}`,
        status:"Success",
        result: result
    });
}

exports.create = async (req, res, next) => {

    var data = req.body;

    const validateSchema = Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
        sellingPrice: Joi.number().min(0).required(),
        mileage: Joi.number().min(0).required(),
        transmission: Joi.string().required(),
        fuelType: Joi.string().required(),
        color: Joi.string().allow(''),
        engine: Joi.string().allow(''),
        drivetrain: Joi.string().allow(''),
        description: Joi.string().allow(''),
        images: Joi.array().items(Joi.string()).optional()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Validation Error", error));

    var dataObj = {
        make: !isEmpty(data.make) ? data.make : '',
        model: !isEmpty(data.model) ? data.model : '',
        year: !isEmpty(data.year) ? data.year : '',
        sellingPrice: !isEmpty(data.sellingPrice) ? data.sellingPrice : 0,
        mileage: !isEmpty(data.mileage) ? data.mileage : 0,
        transmission: !isEmpty(data.transmission) ? data.transmission : '',
        fuelType: !isEmpty(data.fuelType) ? data.fuelType : '',
        color: !isEmpty(data.color) ? data.color : '',
        engine: !isEmpty(data.engine) ? data.engine : '',
        drivetrain: !isEmpty(data.drivetrain) ? data.drivetrain : '',
        description: !isEmpty(data.description) ? data.description : '',
        images: !isEmpty(data.images) ? data.images : []
    }

    let result = await Vehicle.save(dataObj);

    res.status(200).json({
        message: "Vehicle Created Successfully",
        status: "Success",
        result: result
    });
};

exports.updateById = async (req, res, next) => {

    let data = req.body;

    const validateSchema = Joi.object({
        _id: Joi.string().required(),
        make: Joi.string().allow(''),
        model: Joi.string().allow(''),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).allow(''),
        sellingPrice: Joi.number().min(0).allow(''),
        mileage: Joi.number().min(0).allow(''),
        transmission: Joi.string().allow(''),
        fuelType: Joi.string().allow(''),
        color: Joi.string().allow(''),
        engine: Joi.string().allow(''),
        drivetrain: Joi.string().allow(''),
        description: Joi.string().allow(''),
        images: Joi.array().items(Joi.string()).optional(),
        isActive: Joi.bool().allow()
    })

    const error = validate(validateSchema, data)

    if (error) return res.status(400).send(rs.error("Validation Error", error));

    let result = await Vehicle.save(data);

    res.status(200).json({
        message:`Vehicle Details Updated by ID ${mongodb.ObjectId(data._id)}`,
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

    let result = await Vehicle.deleteById(id);

    res.status(200).json({
        message:`Vehicle Deleted by ID ${req.params.id}`,
        status:"Success",
        result: result
    });

}


