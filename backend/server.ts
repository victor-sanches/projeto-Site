// Carrega variáveis de ambiente antes de qualquer outra coisa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./lib/mongodb');
const { Pedido } = require('./models/Pedido');

const app = express();

app.use(cors());
app.use(express.json());

// Conecta no MongoDB
connectToDatabase()
  .then(() => console.log("🟢 MongoDB conectado"))
  .catch((err) => console.error("🔴 Erro na conexão:", err));

// Rotas
app.post("/api/pedidos", async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pedido", detalhes: error });
  }
});

// Inicializa servidor
app.listen(3001, () => {
  console.log("🚀 Servidor rodando na porta 3001");
});
