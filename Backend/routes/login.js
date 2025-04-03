var express = require("express");
var router = express.Router();
var loginController = require("../controllers/loginController.js");
var loginControllerJson = require("../controllers/Frontend/loginControllerJson.js");

router.get("/", (req, res) => {
  const loggedInUser = req.session.user || {};
  res.render("../views/login/login.ejs", { user: loggedInUser, error: "" });
});

router.post("/", loginController.login);
router.post("/json", loginControllerJson.loginJson);

module.exports = router;
