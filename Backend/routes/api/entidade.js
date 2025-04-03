var express = require("express");
var router = express.Router();
var Entitie = require("../../schemas/entities");
const entitieController = require("../../controllers/entitieController");
const entitieControllerJson = require("../../controllers/Frontend/entitieControllerjson.js");

var loginController = require("../../controllers/loginController.js");

router.post("/profile/add", entitieControllerJson.createEntidade);
router.get("/profile",entitieControllerJson.getProfile);
router.post("/profile/update", entitieControllerJson.updateEntitie);
router.get('/pending-entities', entitieControllerJson.getPendingEntities);
router.post('/accept/:id', entitieControllerJson.acceptPendingEntities);
router.post('/reject/:id', entitieControllerJson.rejectPendingEntities);
router.get("/donations", entitieControllerJson.listDonations);
// Rota para obter todas as entidades
router.get("/all",entitieController.getAllEntities);
router.get('/:id',entitieController.getEntitieById);




module.exports = router;
