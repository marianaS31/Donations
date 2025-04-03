var express = require('express');
const loginController = require('../controllers/loginController');
var router = express.Router();

router.get('/', loginController.logout);


module.exports = router;