import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { Pedido } from './models/Pedido.js'; // ajuste o caminho se estiver em outra pasta

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch((err) => console.error('🔴 Erro ao conectar no MongoDB:', err));

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ status: 'API funcionando' });
});

// Rota para criar um novo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar pedido', details: error });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
