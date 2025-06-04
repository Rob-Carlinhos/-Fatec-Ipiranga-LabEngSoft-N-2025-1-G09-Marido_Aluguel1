const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

// ✅ Middleware de validação
exports.validateForgotPassword = [
  check('email').isEmail().normalizeEmail().withMessage('E-mail inválido.')
];

// ✅ Envia e-mail com link de redefinição
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const cleanEmail = sanitizeHtml(req.body.email);

  const token = jwt.sign({ email: cleanEmail }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: cleanEmail,
      subject: 'Redefinição de Senha',
      html: `<p>Clique no link abaixo para redefinir sua senha:</p>
             <a href="${process.env.FRONTEND_URL}/resetar-senha?token=${token}">
               Redefinir senha
             </a>`,
    });

    console.log('✅ Email enviado:', info.messageId);
    console.log('🔗 Link para visualização:', nodemailer.getTestMessageUrl(info));

    res.json({ message: 'Link de redefinição enviado para o e-mail.' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
  }
};
