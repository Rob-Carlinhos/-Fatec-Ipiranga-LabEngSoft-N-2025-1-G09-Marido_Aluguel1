const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { check } = require('express-validator');
require('dotenv').config();

exports.validateResetPassword = [
  check('token').notEmpty().withMessage('Token é obrigatório.'),
  check('password')
    .isStrongPassword()
    .withMessage('A nova senha deve conter letras maiúsculas, minúsculas, número e caractere especial.')
];

async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ error: 'Token inválido: e-mail não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await User.update(
      { password: hashedPassword },
      { where: { email } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado ou senha não alterada.' });
    }

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Token inválido ou expirado.' });
  }
}

exports.resetPassword = resetPassword;
