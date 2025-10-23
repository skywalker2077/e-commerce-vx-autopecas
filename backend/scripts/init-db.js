const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Conectar ao banco padrão primeiro
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🗄️  Iniciando configuração do banco de dados...');

    // Criar banco de dados se não existir
    const dbName = process.env.DB_NAME || 'vx_autopecas';
    
    try {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Banco de dados ${dbName} criado`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`ℹ️  Banco de dados ${dbName} já existe`);
      } else {
        throw error;
      }
    }

    // Conectar ao banco específico
    const appPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

    const appClient = await appPool.connect();

    // Criar extensões
    await appClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    // Criar tabelas
    console.log('📋 Criando tabelas...');

    // Tabela de usuários
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela users criada');

    // Tabela de categorias
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela categories criada');

    // Tabela de produtos
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id),
        brand VARCHAR(100),
        model VARCHAR(100),
        part_number VARCHAR(100),
        images TEXT[], -- Array de URLs das imagens
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela products criada');

    // Tabela de pedidos
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
        shipping_address JSONB,
        payment_method VARCHAR(50),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
        tracking_code VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela orders criada');

    // Tabela de itens do pedido
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela order_items criada');

    // Tabela de carrinho
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `);
    console.log('✅ Tabela cart_items criada');

    // Inserir dados iniciais
    console.log('📝 Inserindo dados iniciais...');

    // Inserir usuário admin
    const adminExists = await appClient.query('SELECT id FROM users WHERE email = $1', ['admin@vxautopecas.com']);
    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await appClient.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4)
      `, ['Administrador', 'admin@vxautopecas.com', hashedPassword, 'admin']);
      console.log('✅ Usuário admin criado (email: admin@vxautopecas.com, senha: admin123)');
    }

    // Inserir categorias
    const categories = [
      { name: 'Motor', slug: 'motor', description: 'Peças para motor do veículo' },
      { name: 'Freios', slug: 'freios', description: 'Sistema de freios e componentes' },
      { name: 'Suspensão', slug: 'suspensao', description: 'Amortecedores, molas e componentes de suspensão' },
      { name: 'Elétrica', slug: 'eletrica', description: 'Componentes elétricos e eletrônicos' },
      { name: 'Filtros', slug: 'filtros', description: 'Filtros de ar, óleo, combustível e cabine' },
      { name: 'Pneus', slug: 'pneus', description: 'Pneus e acessórios para rodas' }
    ];

    for (const category of categories) {
      const exists = await appClient.query('SELECT id FROM categories WHERE slug = $1', [category.slug]);
      if (exists.rows.length === 0) {
        await appClient.query(`
          INSERT INTO categories (name, slug, description) 
          VALUES ($1, $2, $3)
        `, [category.name, category.slug, category.description]);
      }
    }
    console.log('✅ Categorias inseridas');

    // Inserir produtos de exemplo
    const motorCategoryResult = await appClient.query('SELECT id FROM categories WHERE slug = $1', ['motor']);
    const freiosCategoryResult = await appClient.query('SELECT id FROM categories WHERE slug = $1', ['freios']);
    const filtrosCategoryResult = await appClient.query('SELECT id FROM categories WHERE slug = $1', ['filtros']);

    if (motorCategoryResult.rows.length > 0 && freiosCategoryResult.rows.length > 0 && filtrosCategoryResult.rows.length > 0) {
      const motorCategoryId = motorCategoryResult.rows[0].id;
      const freiosCategoryId = freiosCategoryResult.rows[0].id;
      const filtrosCategoryId = filtrosCategoryResult.rows[0].id;

      const products = [
        {
          name: 'Pastilha de Freio Dianteira',
          description: 'Pastilha de freio premium para veículos Honda Civic 2012-2016. Oferece excelente performance e durabilidade.',
          price: 89.90,
          stock: 25,
          category_id: freiosCategoryId,
          brand: 'Honda',
          model: 'Civic',
          part_number: 'HB001'
        },
        {
          name: 'Filtro de Óleo',
          description: 'Filtro de óleo de alta qualidade para motores 1.6. Garantia de 1 ano.',
          price: 35.50,
          stock: 50,
          category_id: filtrosCategoryId,
          brand: 'Toyota',
          model: 'Corolla',
          part_number: 'FL001'
        },
        {
          name: 'Vela de Ignição',
          description: 'Vela de ignição iridium para melhor performance do motor.',
          price: 45.00,
          stock: 100,
          category_id: motorCategoryId,
          brand: 'Universal',
          model: 'Diversos',
          part_number: 'VI001'
        },
        {
          name: 'Disco de Freio Ventilado',
          description: 'Disco de freio ventilado para melhor dissipação de calor.',
          price: 150.00,
          stock: 15,
          category_id: freiosCategoryId,
          brand: 'Ford',
          model: 'Focus',
          part_number: 'DF001'
        }
      ];

      for (const product of products) {
        const exists = await appClient.query('SELECT id FROM products WHERE part_number = $1', [product.part_number]);
        if (exists.rows.length === 0) {
          await appClient.query(`
            INSERT INTO products (name, description, price, stock, category_id, brand, model, part_number) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [product.name, product.description, product.price, product.stock, product.category_id, product.brand, product.model, product.part_number]);
        }
      }
      console.log('✅ Produtos de exemplo inseridos');
    }

    // Criar índices para melhor performance
    await appClient.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)');
    await appClient.query('CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)');
    await appClient.query('CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)');
    await appClient.query('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
    await appClient.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    console.log('✅ Índices criados');

    appClient.release();
    appPool.end();
    console.log('🎉 Banco de dados configurado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
  } finally {
    client.release();
    pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;