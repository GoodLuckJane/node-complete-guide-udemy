const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ProductCart = sequelize.define("product-cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ProductCart;
