import isAuthenticated from './../util/common/isAuthenticated';

const path = require('path');
const express = require('express');
const VehicleController = require('../controllers/Vehicle');
const router = express.Router();

router.get('/', isAuthenticated, VehicleController.getAll);

router.post('/', isAuthenticated, VehicleController.create);

router.get('/:id', isAuthenticated, VehicleController.getById);

router.delete('/:id', isAuthenticated, VehicleController.deleteById);

router.put('/', isAuthenticated, VehicleController.updateById);

module.exports = router;


