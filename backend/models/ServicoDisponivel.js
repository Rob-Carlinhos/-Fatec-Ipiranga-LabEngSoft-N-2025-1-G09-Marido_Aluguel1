module.exports = (sequelize, DataTypes) => {
  const ServicoDisponivel = sequelize.define('ServicoDisponivel', {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'servicos_disponiveis',
    timestamps: false
  });

  return ServicoDisponivel;
};
