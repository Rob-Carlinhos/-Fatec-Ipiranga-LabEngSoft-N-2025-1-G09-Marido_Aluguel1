const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

// ✅ Validação para registro
exports.validateRegister = [
  check('name').trim().escape().notEmpty().withMessage('Nome é obrigatório.'),
  check('address').trim().escape().notEmpty().withMessage('Endereço é obrigatório.'),
  check('phone').trim().isLength({ min: 10 }).withMessage('Telefone inválido.'),
  check('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  check('password')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('A senha deve conter no mínimo 6 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.'),
  check('tipoUsuario')
    .isIn(['cliente', 'prestador'])
    .withMessage('Tipo de usuário inválido.')
];

// ✅ Validação para login
exports.validateLogin = [
  check('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  check('password').notEmpty().withMessage('Senha é obrigatória.')
];

// ✅ REGISTRO (Cadastro de novo usuário)
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, address, phone, email, password, tipoUsuario } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: sanitizeHtml(name),
      address: sanitizeHtml(address),
      phone: sanitizeHtml(phone),
      email,
      password: hashedPassword,
      tipoUsuario
    });

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
};

// ✅ LOGIN (Autenticação)
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tipoUsuario: user.tipoUsuario
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
};

// ✅ PERFIL (Protegido por Token)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'address', 'phone', 'email', 'tipoUsuario']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
  }
};
