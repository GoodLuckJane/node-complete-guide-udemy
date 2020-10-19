const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const cartFilePath = path.join(rootDir, "data", "cart.json");
const Product = require("./product");
const getCart = (cb) =>
  fs.readFile(cartFilePath, (err, data) => {
    let cart = { products: [], totalPrice: 0 };
    if (err) {
      return console.log("get cart error: ", err);
    } else if (data.length !== 0) {
      cart = JSON.parse(data);
    }
    console.log({ cart });
    cb(cart);
  });

const saveCart = (cart, cb) =>
  fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
    if (err) {
      return console.log("save cart error", err);
    }
    cb();
  });

module.exports = class Cart {
  // {products:[{productId,amount},...],totalPrice:0}

  static addToCart(id, price, quantity, cb) {
    getCart((cart) => {
      let existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      let updatedProduct;
      if (existingProductIndex >= 0) {
        const existingProduct = cart.products[existingProductIndex];
        updatedProduct = {
          ...existingProduct,
          quantity: +existingProduct.quantity + quantity,
        };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity };
        cart.products.push(updatedProduct);
      }
      cart.totalPrice = Number(cart.totalPrice) + Number(price) * quantity;
      saveCart(cart, () => {});
    });
  }
  static getCart(cb) {
    getCart(cb);
  }

  static deleteById(id, productPrice, cb) {
    getCart((cart) => {
      let toBeDeletedProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const toBeDeletedProduct = cart.products[toBeDeletedProductIndex];
      if (toBeDeletedProductIndex < 0) {
        return console.log("could not find item");
      }
      cart.products.splice(toBeDeletedProductIndex, 1);
      cart.totalPrice =
        Number(cart.totalPrice) -
        Number(productPrice) * toBeDeletedProduct.quantity;

      saveCart(cart, cb);
    });
  }
  static clearCart(cb) {
    saveCart({ products: [], totalPrice: 0 }, cb);
  }
  //   static addToCart(productId, incrementAmount, cb) {
  //     getCart((err, cart) => {
  //       if (err) {
  //         return cb(err);
  //       }
  //       let productIndex = findProductIndexInCart(cart, productId);
  //       if (productIndex >= 0) {
  //         // increase the amount of existing product in cart by inrementAmount
  //         cart[productIndex][amount] += incrementAmount;
  //       } else {
  //         // add product to cart
  //         cart.push({ productId, amount: incrementAmount });
  //       }
  //       saveCart(cart, cb);
  //     });
  //   }

  //   static editProduct(productId, amount, cb) {
  //     if (amount > 0) {
  //       getCart((err, cart) => {
  //         if (err) {
  //           return cb(err);
  //         }
  //         let productIndex = findProductIndexInCart(cart, productId);
  //         if (productIndex >= 0) {
  //           //edit existing product amount in cart
  //           cart[productIndex] = { productId, amount };
  //         } else {
  //           // add product to cart
  //           cart.push({ productId, amount });
  //         }
  //         saveCart(cart, cb);
  //       });
  //     } else {
  //       this.removeProduct(productId, cb);
  //     }
  //   }
  //   static removeProduct(productId, cb) {
  //     getCart((err, cart) => {
  //       if (err) {
  //         return cb(err);
  //       }
  //       let productIndex = findProductIndexInCart(cart, productId);
  //       if (productIndex >= 0) {
  //         // remove existing product from cart
  //         cart.splice(productIndex, 1);
  //         saveCart(cart, cb);
  //       } else {
  //         cb("Item doen not exist");
  //       }
  //     });
  //   }
};
