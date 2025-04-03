var express = require("express");
var router = express.Router();
const doacaoController = require("../controllers/doacaoController.js");
var loginController = require("../controllers/loginController.js");

router.get("/", loginController.verifyLoginUser, doacaoController.renderDoacao);

router.post(
  "/search",
  loginController.verifyLoginUser,
  doacaoController.search
);

router.get(
  "/list",
  loginController.verifyLoginUser,
  doacaoController.listDoacoes
);

router.get(
  "/create",
  loginController.verifyLoginUser,
  doacaoController.renderCreateDoacao
);

router.post(
  "/create",
  loginController.verifyLoginUser,
  doacaoController.createDoacao
);

router.post(
  "/delete/:id",
  loginController.verifyLoginUser,
  doacaoController.deleteDoacao
);
router.post(
  "/updateState/:id/:index",
  loginController.verifyLoginUser,
  doacaoController.updateState
);

module.exports = router;
