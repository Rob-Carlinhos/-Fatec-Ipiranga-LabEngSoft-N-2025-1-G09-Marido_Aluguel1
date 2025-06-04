const { ServicoDisponivel } = require('../models');

// ✅ Listar todos os serviços fixos
exports.listar = async (req, res) => {
  try {
    const servicos = await ServicoDisponivel.findAll();
    res.json(servicos);
  } catch (err) {
    console.error('Erro ao buscar serviços disponíveis:', err);
    res.status(500).json({ error: 'Erro ao buscar os serviços disponíveis' });
  }
};

// ✅ Buscar um serviço fixo pelo ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const servico = await ServicoDisponivel.findByPk(id);

    if (!servico) {
      return res.status(404).json({ error: 'Serviço fixo não encontrado.' });
    }

    res.json(servico);
  } catch (error) {
    console.error('Erro ao buscar serviço fixo:', error);
    res.status(500).json({ error: 'Erro interno ao buscar serviço fixo.' });
  }
};
