const { Servico, User } = require('../models');
const { check, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// 🛡️ Middleware de validação
exports.validateServico = [
  check('nome').trim().escape().notEmpty().withMessage('Nome é obrigatório'),
  check('telefone').trim().isLength({ min: 10 }).withMessage('Telefone inválido'),
  check('tipo').trim().escape().notEmpty().withMessage('Tipo é obrigatório'),
  check('local').trim().escape().notEmpty().withMessage('Local é obrigatório'),
  check('valor').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo')
];

// 💾 Criar novo serviço
exports.createServico = async (req, res) => {
  const userId = req.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    nome,
    telefone,
    tipo,
    observacao,
    local,
    valor,
    urgente
  } = req.body;

  try {
    const novoServico = await Servico.create({
      userId,
      nome: sanitizeHtml(nome),
      telefone: sanitizeHtml(telefone),
      tipo: sanitizeHtml(tipo),
      observacao: sanitizeHtml(observacao || ''),
      local: sanitizeHtml(local),
      valor,
      urgente: urgente === true
    });

    return res.status(201).json(novoServico);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar serviço' });
  }
};

// 🔍 Listar todos os serviços
exports.getServicos = async (req, res) => {
  try {
    const servicos = await Servico.findAll({
      order: [['urgente', 'DESC'], ['criado_em', 'DESC']]
    });

    return res.json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

// 🔍 Buscar serviço por ID (para página de agendamento)
exports.getServicoById = async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await Servico.findOne({
      where: { id },
      include: {
        model: User,
        as: 'User', // usa o alias conforme definido no model Servico
        attributes: ['id', 'name', 'phone']
      }
    });

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    return res.json({
      id: servico.id,
      tipo: servico.tipo,
      observacao: servico.observacao,
      valor: servico.valor,
      local: servico.local,
      urgente: servico.urgente,
      nome: servico.User.name,
      telefone: servico.User.phone,
      userId: servico.User.id
    });
  } catch (error) {
    console.error('Erro ao buscar serviço por ID:', error);
    return res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
};
