const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho Authorization existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido no cabeçalho Authorization.' });
  }

  // Divide o conteúdo em esquema e token
  const [scheme, token] = authHeader.split(' ');

  // Verifica se está no formato "Bearer token"
  if (!scheme || !token) {
    return res.status(401).json({ error: 'Formato de token inválido.' });
  }

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado. Use "Bearer <token>".' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Define o userId no req para ser usado no controller
    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error('Erro ao verificar token JWT:', err);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
