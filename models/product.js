const db = require("../util/database");

module.exports = class Product {
  static async addItem(newProduct) {
    const { title, imageUrl, description, price } = newProduct;
    const qureyStr = `INSERT INTO products(title,price,description,imageUrl) VALUES('${title}' ,'${price}', '${description}', '${imageUrl}')`;
    console.log("before adding product, query string is:", qureyStr);
    return db.execute(qureyStr);
  }

  static async editById(id, updatedProduct) {
    const { title, imageUrl, description, price } = updatedProduct;
    return db.execute(
      `UPDATE products SET title=${title}, imageUrl=${imageUrl}, description=${description}, price=${price} WHERE id=${id}`
    );
  }
  static async deleteById(id) {
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
