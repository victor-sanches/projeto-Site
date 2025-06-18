import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@lib/mongodb.ts';
import { Pedido } from '@/models/Pedido';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');

  try {
    await connectToDatabase();
    const pedido = await Pedido.create(req.body);
    return res.status(201).json({ message: 'Pedido salvo com sucesso', pedido });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar o pedido', detail: err });
  }
}