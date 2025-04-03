var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');


router.get('/',loginController.verifyLoginUser, function(req, res, next) {
  const loggedInUser = req.session.user || {};
  res.render('index',{ user: loggedInUser });
});

module.exports = router;
