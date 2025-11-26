import isAuthenticated from './../util/common/isAuthenticated';

const path = require('path');
const express = require('express');
const QuoteController = require('../controllers/Quote');
const router = express.Router();

router.get('/', isAuthenticated, QuoteController.getAll);

router.post('/', isAuthenticated, QuoteController.create);

router.get('/:id', isAuthenticated, QuoteController.getById);

router.get('/vehicle/:vehicleId', isAuthenticated, QuoteController.getByVehicleId);

router.get('/email/:email', isAuthenticated, QuoteController.getByEmail);

router.delete('/:id', isAuthenticated, QuoteController.deleteById);

router.put('/', isAuthenticated, QuoteController.updateById);

module.exports = router;

