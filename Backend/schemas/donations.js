const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  entity: { type: String, required: true },
  donations: [
    {
      type: { type: String, required: true },
      quantity: { type: Number },
      kg: { type: Number },
      points: { type: Number },
      color: { type: String },
      clothType: { type: String },
      date: { type: Date, default: Date.now },
      state: { type: String, default: "Analise" },
    },
  ],
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
