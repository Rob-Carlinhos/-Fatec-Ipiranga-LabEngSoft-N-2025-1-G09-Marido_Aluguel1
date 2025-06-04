const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/userController');

// Middleware
const authenticate = require('../middleware/authenticate');

// ROTAS DE USUÁRIO

// 🔐 Registro de novo usuário
router.post(
  '/register',
  userController.validateRegister,
  userController.register
);

// 🔐 Login de usuário
router.post(
  '/login',
  userController.validateLogin,
  userController.login
);

// 🔒 Retorna os dados do usuário autenticado
router.get(
  '/user/me',
  authenticate,
  userController.getProfile
);

module.exports = router;
