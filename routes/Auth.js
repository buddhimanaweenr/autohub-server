const path = require('path');

const express = require('express');

const authDataController = require('../controllers/Auth');

const router = express.Router();

router.post('/login', authDataController.login);
router.post('/verifyToken', authDataController.verifyToken);

module.exports = router;