const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições, tente novamente em 15 minutos.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VX Autopeças API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      path: req.originalUrl
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor VX Autopeças rodando na porta ${PORT}`);
  console.log(`📝 Documentação da API: http://localhost:${PORT}/api/health`);
});