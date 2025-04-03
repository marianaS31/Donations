var express = require('express');
var router = express.Router();
var adminController = require("../controllers/adminController.js");
var loginController = require("../controllers/loginController.js")



router.get('/',loginController.verifyLoginUser,adminController.renderAdmin );

router.get('/add',loginController.verifyLoginUser,adminController.renderAddAdmin );

router.post('/add',loginController.verifyLoginUser,adminController.createAdmin );

router.post('/search',loginController.verifyLoginUser,adminController.searchAdmin );

router.post('/:id/delete',loginController.verifyLoginUser, adminController.deleteAdmin);

router.get('/:id/edit',loginController.verifyLoginUser, adminController.renderEditAdmin);

router.post('/:id/edit',loginController.verifyLoginUser, adminController.updateAdmin);

router.get('/:id/view',loginController.verifyLoginUser, adminController.renderViewAdmin);

module.exports = router;
