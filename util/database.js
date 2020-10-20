const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "root", "July2019!", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
