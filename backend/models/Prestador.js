
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prestador = sequelize.define('Prestador', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enderecoResidencial: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'endereco_residencial'
    },
    enderecoComercial: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'endereco_comercial'
    },
    profissao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cnpj: {
      type: DataTypes.STRING,
      allowNull: true
    },
    criadoEm: {
      type: DataTypes.DATE,
      field: 'criado_em'
    },
    atualizadoEm: {
      type: DataTypes.DATE,
      field: 'atualizado_em'
    }
  }, {
    tableName: 'prestadores',
    createdAt: 'criadoEm',
    updatedAt: 'atualizadoEm',
    timestamps: true
  });

  return Prestador;
};
