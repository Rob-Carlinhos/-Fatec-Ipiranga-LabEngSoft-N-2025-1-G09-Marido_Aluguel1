// models/Servico.js
module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
    nome: DataTypes.STRING,
    telefone: DataTypes.STRING,
    tipo: DataTypes.STRING,
    observacao: DataTypes.STRING,
    local: DataTypes.STRING,
    valor: DataTypes.FLOAT,
    urgente: DataTypes.BOOLEAN,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  }, {
    tableName: 'servicos',
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  Servico.associate = (models) => {
    Servico.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User'
    });
  };

  return Servico;
};
