module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cliente_id'
    },
    prestadorId: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ Agora permite null
      field: 'prestador_id'
    },
    servico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataAgendada: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'data_agendada'
    },
    horaAgendada: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'hora_agendada'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'agendado'
    }
  }, {
    tableName: 'agendamentos',
    timestamps: true
  });

  // Associações
  Agendamento.associate = (models) => {
    Agendamento.belongsTo(models.User, {
      as: 'prestador',
      foreignKey: 'prestadorId'
    });

    Agendamento.belongsTo(models.User, {
      as: 'cliente',
      foreignKey: 'clienteId'
    });
  };

  return Agendamento;
};
