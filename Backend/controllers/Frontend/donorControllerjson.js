const Donors = require("../../schemas/donors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const donorController = {};

// Helper functions for validation
const validateEmail = (email) =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
const validateName = (name) =>
  /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(name) && name.length >= 3;
const validatePassword = (psw) => psw.length >= 5;

donorController.createDonor = async (req, res, next) => {
  const { name, email, psw, lname, age, pswrepeat, tipo } = req.body;

  const errors = [];

  if (!validateName(name)) {
    errors.push("Invalid name format or length less than 3");
  }
  if (!validateName(lname)) {
    errors.push("Invalid last name format or length less than 3");
  }
  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }
  if (age <= 18) {
    errors.push("Age must be greater than 18");
  }
  if (!validatePassword(psw)) {
    errors.push("Password length must be at least 5");
  }
  if (psw !== pswrepeat) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingDonor = await Donors.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(psw, saltRounds);

    const donor = new Donors({
      name,
      age,
      lname,
      email,
      password: hash,
      tipo: "Donor",
      points: 0,
      donatedKg: 0,
    });

    await donor.save();
    res.status(201).json({ message: "Donor created successfully" });
  } catch (err) {
    console.error("Error creating donor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

donorController.getToken = function (req) {
  return req.cookies["token"];
};

donorController.getProfile = async (req, res) => {
  const token = donorController.getToken(req);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    const donorEmail = decoded.email;

    const donor = await Donors.findOne({ email: donorEmail });

    if (donor) {
      return res.status(200).json({
        message: "Donor found",
        donor: {
          email: donor.email,
          name: donor.name,
          points: donor.points,
        },
      });
    } else {
      return res.status(404).json({ message: "Donor not found" });
    }
  } catch (error) {
    console.error("Error getting profile:", error);
    return res.status(500).send("Error rendering donor page.");
  }
};

donorController.updateDonor = async (req, res) => {
  const token = donorController.getToken(req);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const { name, lname, email, psw, pswrepeat } = req.body;

  const errors = [];

  if (!validateEmail(email)) {
    errors.push("Invalid email format");
  }
  if (!validateName(name)) {
    errors.push("Invalid name format or length less than 3");
  }
  if (!validateName(lname)) {
    errors.push("Invalid last name format or length less than 3");
  }
  if (psw && !validatePassword(psw)) {
    errors.push("Password length must be at least 5");
  }
  if (psw !== pswrepeat) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    const donorEmail = decoded.email;

    const updateFields = { name, lname, email };
    if (psw) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(psw, saltRounds);
      updateFields.password = hashedPassword;
    }

    const updatedDonor = await Donors.findOneAndUpdate(
      { email: donorEmail },
      updateFields,
      { new: true }
    );

    if (updatedDonor) {
      res
        .status(200)
        .json({ message: "Donor updated successfully", donor: updatedDonor });
    } else {
      res.status(404).json({ message: "Donor not found" });
    }
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({ message: "Error updating donor." });
  }
};

donorController.checkEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const donor = await Donors.findOne({ email });
    if (donor) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const Donation = require("../../schemas/donations");

donorController.getDonationCount = async (req, res) => {
  try {
    const token = donorController.getToken(req);
    const decoded = jwt.verify(token, "PAW");
    const email = decoded.email;

    const donations = await Donation.find({ donorEmail: email });

    if (donations.length === 0) {
      return res
        .status(404)
        .json({ error: "No donations found for this email" });
    }

    const totalDonationCount = donations.reduce(
      (acc, donation) => acc + donation.donations.length,
      0
    );

    res.status(200).json({ count: totalDonationCount });
  } catch (error) {
    console.error("Error fetching donation count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

donorController.getDonationsByEmail = async (req, res) => {
  try {
    const token = donorController.getToken(req);
    const decoded = jwt.verify(token, "PAW");
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const donationsData = await Donation.find({ donorEmail: email });

    const formattedDonations = donationsData.reduce((acc, donation) => {
      donation.donations.forEach((d) => {
        acc.push({
          donorEmail: donation.donorEmail,
          entity: donation.entity,
          points: d.points,
          type: d.type,
          quantity: d.quantity,
          kg: d.kg,
          color: d.color,
          clothType: d.clothType,
          date: d.date,
        });
      });
      return acc;
    }, []);

    res.status(200).json({ donations: formattedDonations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

donorController.getPointsEvolution = async (req, res) => {
  try {
    const token = donorController.getToken(req);
    const decoded = jwt.verify(token, "PAW");
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const donationsData = await Donation.find({ donorEmail: email });

    const pointsEvolution = donationsData.reduce((acc, donation) => {
      donation.donations.forEach((d) => {
        acc.push({
          points: d.points,
          date: d.date,
        });
      });
      return acc;
    }, []);

    res.status(200).json({ pointsEvolution });
  } catch (error) {
    console.error("Error fetching points evolution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

donorController.redeemCoupon = async (req, res) => {
  const { couponValue } = req.body;
  console.log(couponValue);

  const couponToPoints = {
    1: 100,
    5: 500,
    10: 1000,
    20: 2000,
  };

  if (!couponToPoints.hasOwnProperty(couponValue)) {
    return res.status(400).json({ error: "Invalid coupon value" });
  }

  const pointsToRemove = couponToPoints[couponValue];

  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, "PAW");
    const donorEmail = decoded.email;

    const donor = await Donors.findOne({ email: donorEmail });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    if (donor.points < pointsToRemove) {
      return res.status(400).json({ error: "Insufficient points" });
    }

    donor.points -= pointsToRemove;
    donor.coupon += parseInt(couponValue);

    if (isNaN(donor.coupon)) {
      return res
        .status(500)
        .json({ error: "Failed to redeem coupon, please try again." });
    }

    await donor.save();

    res
      .status(200)
      .json({ message: "Coupon redeemed successfully", points: donor.points });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = donorController;
