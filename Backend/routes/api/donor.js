var express = require("express");
var router = express.Router();
var donorController = require("../../controllers/Frontend/donorControllerjson.js");
var loginController = require("../../controllers/loginController.js");

router.get(
  "/profile",
  loginController.verifyLoginUser,
  donorController.getProfile
);
router.post("/profile/update", donorController.updateDonor);
router.post("/profile/add", donorController.createDonor);
router.get("/check-email", donorController.checkEmail);
router.get("/profile/ndonations", donorController.getDonationCount);
router.get("/donations", donorController.getDonationsByEmail);
router.get("/pointsEvolution", donorController.getPointsEvolution);
router.post("/redeemCoupon", donorController.redeemCoupon);

module.exports = router;
