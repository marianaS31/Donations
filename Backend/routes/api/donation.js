var express = require("express");
var router = express.Router();
const doacaoController = require("../../controllers/Frontend/donationControllerjson.js");

router.post("/create-paypal-payment", doacaoController.createPaypalPayment);
router.post("/execute-paypal-payment", doacaoController.executePaypalPayment);
router.post("/create-doacao", doacaoController.createDoacao);
router.get("/list-doacoes", doacaoController.listDoacoes);
router.patch("/update-state/:entityName/:index", doacaoController.updateState);
module.exports = router;
