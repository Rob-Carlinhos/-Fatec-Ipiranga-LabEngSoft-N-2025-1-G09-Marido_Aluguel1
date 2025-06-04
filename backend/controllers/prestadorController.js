const { Prestador } = require('../models');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

// Validação para os campos do prestador
exports.validatePrestador = [
  check('nome').notEmpty().withMessage('Nome é obrigatório'),
  check('cpf').notEmpty().withMessage('CPF é obrigatório'),
  check('enderecoResidencial').notEmpty().withMessage('Endereço residencial é obrigatório'),
  check('telefone').notEmpty().withMessage('Telefone é obrigatório'),
  check('profissao').notEmpty().withMessage('Profissão é obrigatória'),
];

// Buscar dados do prestador logado
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

// Criar ou atualizar dados do prestador
exports.savePrestador = async (req, res) => {
  // Verifica erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId;
  const {
    nome,
    cpf,
    enderecoResidencial,
    enderecoComercial,
    telefone,
    profissao,
    empresa,
    cnpj,
  } = req.body;

  try {
    const existing = await Prestador.findOne({ where: { userId } });

    if (existing) {
      await existing.update({
        nome,
        cpf,
        enderecoResidencial,
        enderecoComercial,
        telefone,
        profissao,
        empresa,
        cnpj,
      });

      return res.json({ message: 'Dados do prestador atualizados com sucesso!' });
    }

    await Prestador.create({
      userId,
      nome,
      cpf,
      enderecoResidencial,
      enderecoComercial,
      telefone,
      profissao,
      empresa,
      cnpj,
    });

    return res.status(201).json({ message: 'Prestador cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar prestador:', error);
    return res.status(500).json({ error: 'Erro ao salvar dados do prestador.' });
  }
};
