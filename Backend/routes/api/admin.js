var express = require("express");
var router = express.Router();
var adminController = require("../../controllers/Frontend/adminControllerjson.js");
var loginController = require("../../controllers/loginController.js");

router.get(
  "/profile",
  loginController.verifyLoginUser,
  adminController.getProfile
);
router.post("/profile/update", adminController.updateAdmin);

router.get("/average-kg-per-donation", adminController.getAverageKgPerDonation);
router.get("/donations-per-district", adminController.getDonationsPerDistrict);
router.get("/clothing-types-pie", adminController.getClothingTypesPie);
module.exports = router;
