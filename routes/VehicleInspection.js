import isAuthenticated from './../util/common/isAuthenticated';

const path = require('path');
const express = require('express');
const VehicleInspectionController = require('../controllers/VehicleInspection');
const router = express.Router();

router.get('/', isAuthenticated, VehicleInspectionController.getAll);

router.post('/', isAuthenticated, VehicleInspectionController.create);

router.get('/:id', isAuthenticated, VehicleInspectionController.getById);

router.get('/vehicle/:vehicleId', isAuthenticated, VehicleInspectionController.getByVehicleId);

router.get('/email/:email', isAuthenticated, VehicleInspectionController.getByEmail);

router.delete('/:id', isAuthenticated, VehicleInspectionController.deleteById);

router.put('/', isAuthenticated, VehicleInspectionController.updateById);

module.exports = router;

