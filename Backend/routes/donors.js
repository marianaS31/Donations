var express = require('express');
var router = express.Router();
var donorController = require("../controllers/donorController.js");
var loginController = require("../controllers/loginController.js")

router.get('/',loginController.verifyLoginUser, donorController.renderDonor);

router.get('/add',loginController.verifyLoginUser,donorController.renderAddDonor);

router.post('/add',loginController.verifyLoginUser,donorController.createDonor );

router.post('/search',loginController.verifyLoginUser, donorController.searchDonor);

router.post('/:id/delete',loginController.verifyLoginUser, donorController.deleteDonor);

router.get('/:id/edit',loginController.verifyLoginUser, donorController.renderEditDoador);

router.post('/:id/edit',loginController.verifyLoginUser, donorController.updateDoador);

router.get('/:id/view',loginController.verifyLoginUser, donorController.renderViewDonor);

module.exports = router;
