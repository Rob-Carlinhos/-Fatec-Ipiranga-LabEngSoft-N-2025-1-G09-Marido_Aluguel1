const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

// Importa os modelos passando a conexão e os DataTypes
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Prestador = require('./Prestador')(sequelize, Sequelize.DataTypes);
const Servico = require('./Servico')(sequelize, Sequelize.DataTypes);
const Agendamento = require('./Agendamento')(sequelize, Sequelize.DataTypes);
const ServicoDisponivel = require('./ServicoDisponivel')(sequelize, Sequelize.DataTypes); // ✅ Novo modelo

// Exporta os modelos e a conexão
module.exports = {
  sequelize,
  Sequelize,
  User,
  Prestador,
  Servico,
  Agendamento,
  ServicoDisponivel // ✅ Incluído na exportação
};

// Executa as associações se existirem
Object.values(module.exports).forEach((model) => {
  if (model.associate) {
    model.associate(module.exports);
  }
});
