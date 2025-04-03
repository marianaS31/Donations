const express = require('express');
const router = express.Router();
const mailgunController = require('../controllers/mailgunController');

router.post('/send-email', mailgunController.sendEmail);

module.exports = router;
