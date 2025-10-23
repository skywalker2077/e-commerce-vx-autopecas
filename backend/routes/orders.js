const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Criar pedido (apenas usuários autenticados)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, shipping_address, payment_method } = req.body;
    const userId = req.user.userId;

    // Calcular total do pedido
    let total = 0;
    for (const item of items) {
      const productResult = await db.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (productResult.rows.length === 0) {
        return res.status(400).json({ error: `Produto ${item.product_id} não encontrado` });
      }
      total += productResult.rows[0].price * item.quantity;
    }

    // Criar pedido
    const orderResult = await db.query(`
      INSERT INTO orders (user_id, total, shipping_address, payment_method, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
    `, [userId, total, JSON.stringify(shipping_address), payment_method]);

    const order = orderResult.rows[0];

    // Criar itens do pedido
    for (const item of items) {
      await db.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))
      `, [order.id, item.product_id, item.quantity]);

      // Atualizar estoque
      await db.query(`
        UPDATE products SET stock = stock - $1 WHERE id = $2
      `, [item.quantity, item.product_id]);
    }

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar pedidos do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(`
      SELECT o.*, 
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar pedido específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await db.query(`
      SELECT o.*, 
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;