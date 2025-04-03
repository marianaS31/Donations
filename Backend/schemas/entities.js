const mongoose = require("mongoose");
const donationSchema = new mongoose.Schema({
  type: String,
  kg: Number,
  color: String,
  clothType: String,
  state: String,
  points: Number,
  donorEmail: String,
  quantity: Number,
  date: { type: Date, default: Date.now }, // Add this line
});

const entitiesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      match: [/^[a-zA-Z ]+$/, 'Nome inválido: apenas letras e espaços são permitidos'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      match: [/^[a-zA-Z ]+$/, 'Descrição inválida: apenas letras e espaços são permitidos'],
    },
    image: {
      type: String,
      required: [true, 'Imagem é obrigatória'],
    },
    distrito: {
      type: String,
      required: [true, 'Distrito é obrigatório'],
      match: [/^[a-zA-Z ]+$/, 'Distrito inválido: apenas letras e espaços são permitidos'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },
    status: {
      type: String,
      default: "Pending",
    },
    donations: [donationSchema],
  });
module.exports = mongoose.model("Entities", entitiesSchema);
