const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// ✅ Middleware de segurança CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Defina FRONTEND_URL no .env para ambientes reais
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Middleware para interpretar JSON
app.use(express.json());

// ✅ Middleware para interpretar URL encoded (caso necessário futuramente)
// app.use(express.urlencoded({ extended: true }));

// ✅ Rotas da API
app.use('/api', routes);

// ✅ Rota padrão (teste rápido de funcionamento)
app.get('/', (req, res) => {
  res.status(200).send('✅ API rodando corretamente.');
});

// ✅ Inicializa o servidor na porta definida
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend rodando na porta ${PORT}`);
});
