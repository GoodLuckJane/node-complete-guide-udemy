const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(cb) {
    getProductsFromFile((products) => {
      if (this.id) {
        const updatedProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        products[updatedProductIndex] = { ...this };
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          return console.log(err);
        }
        cb();
      });
    });
  }

  static deleteById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      const updatedProductList = products.filter(
        (product) => product.id !== id
      );
      Cart.deleteById(id, product.price, () => {});
      fs.writeFile(p, JSON.stringify(updatedProductList), (err) => {
        if (err) {
          return console.log(err);
        }
        cb();
      });
      // delete from cart is it is in there
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
