const mongoose = require('mongoose');

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI não está definida no .env');
  }

  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI);
}

module.exports = { connectToDatabase };