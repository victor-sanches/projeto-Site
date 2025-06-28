const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  produto: String,
  valor: Number,
  data: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = { Pedido };