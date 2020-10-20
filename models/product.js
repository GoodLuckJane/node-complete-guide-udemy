const db = require("../util/database");

module.exports = class Product {
  static addItem(newProduct) {
    const { title, imageUrl, description, price } = newProduct;
    return db.execute(
      "INSERT INTO products(title,price,description,imageUrl) VALUES(?,?,?,?)",
      [title, price, description, imageUrl]
    );
  }

  static editById(id, updatedProduct) {
    const { title, imageUrl, description, price } = updatedProduct;
    return db.execute(
      "UPDATE products SET title=?, imageUrl=?, description=?, price=? WHERE id=?",
      [title, imageUrl, description, price, id]
    );
  }
  static deleteById(id) {
    return db.execute(`DELETE FROM products WHERE id=${id}`);
  }

  static async fetchAll() {
    const products = await db.execute("SELECT * FROM products");
    return products[0];
  }

  static async getById(id) {
    const product = await db.execute(`SELECT * FROM products WHERE id=${id}`);
    return product[0][0];
  }
};
