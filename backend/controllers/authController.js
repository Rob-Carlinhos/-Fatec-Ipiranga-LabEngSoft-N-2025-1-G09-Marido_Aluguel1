const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

// ✅ Middleware de validação
exports.validateResetPassword = [
  check('token').notEmpty().withMessage('Token de redefinição é obrigatório.'),
  check('newPassword')
    .isStrongPassword()
    .withMessage('A nova senha deve conter letras maiúsculas, minúsculas, número e caractere especial.')
];

// ✅ Rota para redefinir a senha com token
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(400).json({ error: 'Token inválido ou expirado.' });
  }
};
