const Admins = require("../../schemas/admins");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Entities = require("../../schemas/entities");

const adminController = {};

// Method to get the token
adminController.getToken = function (req) {
  console.log("Request cookies:", req.cookies);
  const tokenFromCookie = req.cookies["token"];
  console.log("Token from cookie:", tokenFromCookie);
  return tokenFromCookie;
};

adminController.getProfile = async (req, res) => {
  const token = adminController.getToken(req);
  console.log("Retrieved token:", token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    const adminEmail = decoded.email;
    console.log("Decoded email:", adminEmail);

    const admin = await Admins.findOne({ email: adminEmail });

    if (admin) {
      return res.status(200).json({
        message: "Admin found",
        admin: {
          email: admin.email,
          name: admin.name,
          role: decoded.role,
        },
      });
    } else {
      return res
        .status(404)
        .json({ message: "Admin not found", email: adminEmail });
    }
  } catch (error) {
    console.error("Error during token verification or finding admin:", error);
    return res.status(500).send("Error rendering donor page.");
  }
};

adminController.updateAdmin = async (req, res) => {
  console.log("Request cookies:", req.cookies); // Log cookies to verify presence
  const token = adminController.getToken(req);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const adminId = req.params.id;
  const { name, email, psw, pswrepeat, tipo } = req.body;

  try {
    const decoded = jwt.verify(token, "PAW");
    const adminEmail = decoded.email;

    const updateFields = { name, email, psw, pswrepeat, tipo };

    const updatedAdmin = await Admins.findOneAndUpdate(
      { email: adminEmail }, // Query to find the admin by email
      updateFields, // Fields to update
      { new: true } // Options: return the new document
    );

    if (updatedAdmin) {
      res
        .status(200)
        .json({ message: "Admin updated successfully", admin: updatedAdmin });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error("Erro ao atualizar o admin:", error);
    res.status(500).json({ message: "Erro ao atualizar o admin." });
  }
};

adminController.getAverageKgPerDonation = async (req, res) => {
  try {
    const result = await Entities.aggregate([
      { $unwind: "$donations" },
      { $group: { _id: null, avgKg: { $avg: "$donations.kg" } } },
    ]);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching average kg per donation:", error);
    res.status(500).send("Error fetching average kg per donation.");
  }
};

adminController.getDonationsPerDistrict = async (req, res) => {
  try {
    const result = await Entities.aggregate([
      {
        $group: {
          _id: "$distrito",
          totalDonations: { $sum: { $size: "$donations" } },
        },
      },
      { $sort: { totalDonations: -1 } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching donations per district:", error);
    res.status(500).send("Error fetching donations per district.");
  }
};

adminController.getClothingTypesPie = async (req, res) => {
  try {
    const result = await Entities.aggregate([
      { $unwind: "$donations" },
      { $group: { _id: "$donations.clothType", count: { $sum: 1 } } },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching clothing types pie data:", error);
    res.status(500).send("Error fetching clothing types pie data.");
  }
};

module.exports = adminController;
