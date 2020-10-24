const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: Sequelize.ENUM(["canceled", "paid", "unpaid", "completed"]),
    allowNull: false,
  },
});

module.exports = Order;
