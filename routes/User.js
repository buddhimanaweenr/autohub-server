import isAuthenticated from './../util/common/isAuthenticated';

const path = require('path');
const express = require('express');
const UserController = require('../controllers/User');
const router = express.Router();

router.get('/', isAuthenticated, UserController.getAll);

router.post('/', isAuthenticated, UserController.create);

router.get('/:id', isAuthenticated, UserController.getById);

router.delete('/:id', isAuthenticated, UserController.deleteById);

router.put('/', isAuthenticated, UserController.updateById);

module.exports = router;