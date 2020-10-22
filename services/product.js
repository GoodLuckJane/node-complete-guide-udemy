const Product = require("../models/product");

exports.getProductList = async () => {
  return Product.findAll();
};

exports.getProductById = async (id) => {
  return Product.findByPk(id);
};

exports.addProduct = async (productObj) => {
  return Product.create(productObj);
};

exports.deleteProduct = async (id) => {
  return Product.destroy({ where: { id }, force: true });
};

exports.updateProduct = async (id, updatedProductObj) => {
  return Product.update(updatedProductObj, { where: { id } });
};
