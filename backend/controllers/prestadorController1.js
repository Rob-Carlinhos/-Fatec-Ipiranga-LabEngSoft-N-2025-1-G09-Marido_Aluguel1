const { Prestador } = require('../models');
const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

// 🚨 Middleware de validação
exports.validatePrestador = [
  check('nome').trim().escape().notEmpty().withMessage('Nome é obrigatório'),
  check('cpf').matches(/^\d{11}$/).withMessage('CPF deve conter 11 dígitos numéricos'),
  check('telefone').trim().isLength({ min: 10 }).withMessage('Telefone inválido'),
  check('endereco_residencial').trim().escape().notEmpty().withMessage('Endereço residencial é obrigatório'),
  check('profissao').trim().escape().notEmpty().withMessage('Profissão é obrigatória'),
];

// 🔍 Buscar dados do prestador logado
exports.getMe = async (req, res) => {
  try {
    const prestador = await Prestador.findOne({
      where: { userId: req.userId },
    });

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador não encontrado.' });
    }

    return res.json(prestador);
  } catch (error) {
    console.error('Erro ao buscar prestador:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do prestador.' });
  }
};

// 💾 Criar ou atualizar dados do prestador
exports.savePrestador = async (req, res) => {
  const userId = req.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // ✨ Sanitizar todos os campos de entrada
  const {
    nome,
    cpf,
    endereco_residencial,
    endereco_comercial,
    telefone,
    profissao,
    empresa,
    entrada,
    saida,
    cnpj
  } = req.body;

  const dadosSanitizados = {
    userId,
    nome: sanitizeHtml(nome),
    cpf: sanitizeHtml(cpf),
    telefone: sanitizeHtml(telefone),
    enderecoResidencial: sanitizeHtml(endereco_residencial),
    enderecoComercial: sanitizeHtml(endereco_comercial || ''),
    profissao: sanitizeHtml(profissao),
    empresa: sanitizeHtml(empresa || ''),
    entrada,
    saida,
    cnpj: sanitizeHtml(cnpj || '')
  };

  try {
    const existing = await Prestador.findOne({ where: { userId } });

    if (existing) {
      await existing.update(dadosSanitizados);
      return res.json({ message: 'Dados do prestador atualizados com sucesso!' });
    }

    await Prestador.create(dadosSanitizados);
    return res.status(201).json({ message: 'Prestador cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar prestador:', error);
    return res.status(500).json({ error: 'Erro ao salvar dados do prestador.' });
  }
};
