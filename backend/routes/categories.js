const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Listar todas as categorias (público)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.active = true
      WHERE c.active = true
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar categoria por slug (público)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.active = true
      WHERE c.slug = $1 AND c.active = true
      GROUP BY c.id
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;