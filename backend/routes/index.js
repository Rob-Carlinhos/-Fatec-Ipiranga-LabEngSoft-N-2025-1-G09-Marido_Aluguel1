const express = require('express');
const router = express.Router();

// 📦 Controllers
const emailController = require('../controllers/emailController');
const passwordResetController = require('../controllers/passwordResetController');
const userController = require('../controllers/userController');
const prestadorController = require('../controllers/prestadorController');
const servicoController = require('../controllers/servicoController');
const agendamentoController = require('../controllers/agendamentoController');
const servicosDisponiveisController = require('../controllers/servicosDisponiveisController'); // ✅ Novo controller

// 🔐 Middleware
const authenticate = require('../middleware/authenticate');

// ==================== 🧾 ROTAS DE USUÁRIO ====================
router.post('/register', ...(userController.validateRegister || []), userController.register);
router.post('/login', ...(userController.validateLogin || []), userController.login);
router.get('/user/me', authenticate, userController.getProfile);

// ==================== 🔄 ROTAS DE SENHA ====================
router.post('/forgot-password', ...(emailController.validateForgotPassword || []), emailController.forgotPassword);
router.post('/reset-password', ...(passwordResetController.validateResetPassword || []), passwordResetController.resetPassword);

// ==================== ✅ ROTAS DE PRESTADOR ====================
router.post('/prestador', authenticate, ...(prestadorController.validatePrestador || []), prestadorController.savePrestador);
router.get('/prestador/me', authenticate, prestadorController.getMe);

// ==================== ✅ ROTAS DE SERVIÇOS ====================
router.post('/servicos', authenticate, ...(servicoController.validateServico || []), servicoController.createServico);
router.get('/servicos', authenticate, servicoController.getServicos);
router.get('/servicos/:id', authenticate, servicoController.getServicoById);

// ==================== ✅ ROTAS DE AGENDAMENTOS ====================

// Agendamentos
router.post('/agendamentos', authenticate, agendamentoController.criar);
router.get('/agendamentos/cliente', authenticate, agendamentoController.listarPorCliente);
router.get('/agendamentos/prestador', authenticate, agendamentoController.listarPorPrestador);
router.patch('/agendamentos/:id/aceitar', authenticate, agendamentoController.aceitar);

// ==================== ✅ ROTAS DE SERVIÇOS DISPONÍVEIS (fixos) ====================
router.get('/servicos-disponiveis', servicosDisponiveisController.listar);
router.get('/servicos-disponiveis/:id', servicosDisponiveisController.buscarPorId);


// 🚪 Exporta as rotas agrupadas em '/api' no server.js
module.exports = router;
