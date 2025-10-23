const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Listar todos os produtos (público)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.active = true
    `;
    let params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Contar total de produtos para paginação
    let countQuery = `
      SELECT COUNT(*) 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.active = true
    `;
    let countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND c.slug = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (p.name ILIKE $${countParamCount} OR p.description ILIKE $${countParamCount} OR p.brand ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar produto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1 AND p.active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar produto (apenas admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category_id,
      brand,
      model,
      part_number,
      images
    } = req.body;

    const result = await db.query(`
      INSERT INTO products (
        name, description, price, stock, category_id, 
        brand, model, part_number, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `, [name, description, price, stock, category_id, brand, model, part_number, images]);

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar produto (apenas admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      category_id,
      brand,
      model,
      part_number,
      images,
      active
    } = req.body;

    const result = await db.query(`
      UPDATE products SET 
        name = $1, description = $2, price = $3, stock = $4,
        category_id = $5, brand = $6, model = $7, part_number = $8,
        images = $9, active = $10, updated_at = NOW()
      WHERE id = $11 
      RETURNING *
    `, [name, description, price, stock, category_id, brand, model, part_number, images, active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({
      message: 'Produto atualizado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar produto (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - apenas marca como inativo
    const result = await db.query(
      'UPDATE products SET active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;