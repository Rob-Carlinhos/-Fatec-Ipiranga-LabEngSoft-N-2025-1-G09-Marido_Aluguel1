const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O nome não pode ser vazio.' }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O endereço não pode ser vazio.' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O telefone não pode ser vazio.' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este e-mail já está cadastrado.'
      },
      validate: {
        isEmail: { msg: 'E-mail inválido.' },
        notEmpty: { msg: 'O e-mail é obrigatório.' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'A senha é obrigatória.' }
      }
    },
    tipoUsuario: {
      type: DataTypes.ENUM('cliente', 'prestador'),
      allowNull: false,
      defaultValue: 'cliente',
      field: 'tipo_usuario',
      validate: {
        isIn: {
          args: [['cliente', 'prestador']],
          msg: 'Tipo de usuário inválido.'
        }
      }
    }
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true
  });

  return User;
};
