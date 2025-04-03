var express = require('express');
var router = express.Router();
var entitieController = require("../controllers/entitieController.js");
var loginController = require("../controllers/loginController.js")


router.get('/',loginController.verifyLoginUser, entitieController.renderEntitie);

router.get('/add',loginController.verifyLoginUser, entitieController.renderAddEntitie);

router.post('/add',loginController.verifyLoginUser,entitieController.createEntitie );

router.post('/search',loginController.verifyLoginUser,entitieController.searchEntitie );

router.post('/:id/delete', loginController.verifyLoginUser,entitieController.deleteEntitie);

router.get('/:id/edit',loginController.verifyLoginUser, entitieController.renderEditEntitie);

router.post('/:id/edit',loginController.verifyLoginUser, entitieController.updateEntitie);

router.get('/:id/view',loginController.verifyLoginUser, entitieController.renderViewEntitie);

router.get("/all",loginController.verifyLoginUser, entitieController.getAllEntities);

module.exports = router;
