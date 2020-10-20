const Product = require("../models/product");

exports.getProductList = () => {
  return Product.findAll();
};

exports.getProductById = (id) => {
  return Product.findByPk(id);
};

exports.addProduct = (productObj) => {
  return Product.create(productObj);
};

exports.deleteProduct = (id) => {
  return Product.destroy({ where: { id }, force: true });
};

exports.updateProduct = (id, updatedProductObj) => {
  return Product.update(updatedProductObj, { where: { id } });
};
