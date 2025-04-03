const Admins = require("../../schemas/admins");
const Donors = require("../../schemas/donors");
const Entitie = require("../../schemas/entities");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var loginControllerJson = {};

// Login method
loginControllerJson.loginJson = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admins.findOne({ email });
  const donor = await Donors.findOne({ email });
  const entitie = await Entitie.findOne({ email });


  if (admin || donor ||entitie) {
    const user = admin || donor||entitie;
    console.log("User object:", user); // Log user object for debugging
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ email: user.email }, "PAW", {
      expiresIn: "24h",
    });
    req.session.user = { email: user.email };
    res.cookie("token", token, { httpOnly: true });
    return res.json({ message: "Login successful", token });
  } else {
    return res.status(404).json({ error: "Email not found" });
  }
};

// Get role method
loginControllerJson.getRole = async (req, res) => {
  const token = req.cookies["token"];
  console.log("token " + token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PAW");
    console.log("decoded " + JSON.stringify(decoded)); // Log decoded token for debugging

    const admin = await Admins.findOne({ email: decoded.email });
    const donor = await Donors.findOne({ email: decoded.email });
    const entitie = await Entitie.findOne({ email: decoded.email });


    if (admin) {
      return res.json({ role: "admin" });
    } else if (donor) {
      return res.json({ role: "donor" });
    } else if (entitie) {
      return res.json({ role: "entitie" });
    } else {
      return res.status(404).json({ error: "Email not found" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = loginControllerJson;
