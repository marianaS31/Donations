const mongoose = require("mongoose");
const donorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  lname: {
    type: String,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
    default: "Donor",
  },
  points: {
    type: Number,
  },
  donatedKg: {
    type: Number,
  },
  coupon: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Donors", donorsSchema);
