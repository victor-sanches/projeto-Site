// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Pedido } from '../models/Pedido.js';

dotenv.config({ path: './lib/.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch(err => console.error('🔴 Erro MongoDB:', err));

app.get('/api', (_, res) => {
  res.json({ status: 'API funcionando' });
});

app.post('/api/pedidos', async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar pedido', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});