const { Agendamento, User } = require('../models');

// ✅ Criar agendamento (prestadorId pode ser null)
exports.criar = async (req, res) => {
  try {
    const { clienteId, prestadorId, servico, dataAgendada, horaAgendada } = req.body;

    if (!clienteId || !servico || !dataAgendada || !horaAgendada) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // ⚠️ Verificar se o horário já está ocupado para o mesmo prestador
    if (prestadorId) {
      const conflito = await Agendamento.findOne({
        where: {
          prestadorId,
          dataAgendada,
          horaAgendada
        }
      });

      if (conflito) {
        return res.status(409).json({ error: 'Este horário já está ocupado com este prestador. Escolha outro.' });
      }
    }

    const novoAgendamento = await Agendamento.create({
      clienteId,
      prestadorId: prestadorId ?? null,
      servico,
      dataAgendada,
      horaAgendada
    });

    return res.status(201).json({
      message: 'Agendamento criado com sucesso!',
      agendamento: novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ error: 'Erro ao processar o agendamento.' });
  }
};

// ✅ Listar agendamentos para o prestador autenticado
exports.listarPorPrestador = async (req, res) => {
  try {
    const prestadorId = req.userId;

    const agendamentos = await Agendamento.findAll({
      where: { prestadorId },
      order: [['dataAgendada', 'ASC'], ['horaAgendada', 'ASC']]
    });

    return res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
};

// ✅ Listar agendamentos para o cliente autenticado
exports.listarPorCliente = async (req, res) => {
  try {
    const clienteId = req.userId;

    const agendamentos = await Agendamento.findAll({
      where: { clienteId },
      include: [
        {
          model: User,
          as: 'prestador',
          attributes: ['name', 'phone', 'email']
        }
      ],
      order: [['dataAgendada', 'DESC'], ['horaAgendada', 'DESC']]
    });

    return res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos do cliente:', error);
    return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
};

// ✅ Aceitar agendamento (prestador atribui-se ao agendamento)
exports.aceitar = async (req, res) => {
  const agendamentoId = req.params.id;
  const prestadorId = req.userId;

  try {
    const agendamento = await Agendamento.findByPk(agendamentoId);

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (agendamento.prestadorId) {
      return res.status(400).json({ error: 'Esse agendamento já foi aceito por outro prestador' });
    }

    // Verificar se o horário já está ocupado para este prestador
    const conflito = await Agendamento.findOne({
      where: {
        prestadorId,
        dataAgendada: agendamento.dataAgendada,
        horaAgendada: agendamento.horaAgendada
      }
    });

    if (conflito) {
      return res.status(409).json({ error: 'Você já tem um agendamento neste horário.' });
    }

    agendamento.prestadorId = prestadorId;
    agendamento.status = 'Aceito';
    await agendamento.save();

    return res.json({ message: 'Serviço aceito com sucesso' });
  } catch (err) {
    console.error('Erro ao aceitar agendamento:', err);
    return res.status(500).json({ error: 'Erro ao aceitar agendamento' });
  }
};
