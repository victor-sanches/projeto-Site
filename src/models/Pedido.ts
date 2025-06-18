import mongoose, { Schema, model, models } from 'mongoose';

const PedidoSchema = new Schema({
  nome: String,
  email: String,
  telefone: String,
  endereco: String,
  cidade: String,
  cep: String,
  total: Number,
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
}, {
  timestamps: true
});

export const Pedido = models.Pedido || model('Pedido', PedidoSchema);