const Sequelize = require("sequelize");
const { Order } = require(".");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
