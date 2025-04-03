var express = require("express");
var router = express.Router();
var loginControllerJson = require("../../controllers/Frontend/loginControllerJson");

router.post("/login", loginControllerJson.loginJson);
router.get("/role", loginControllerJson.getRole);

module.exports = router;
