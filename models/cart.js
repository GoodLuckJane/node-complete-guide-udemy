const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const cartFilePath = path.join(rootDir, "data", "cart.json");

const getCart = (cb) =>
  fs.readFile(cartFilePath, (err, data) => {
    let cart = [];
    if (err) {
      cb(err, []);
    } else {
      cart = JSON.parse(data);
      cb(null, cart);
    }
  });

const saveCart = (cart, cb) =>
  fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
    if (err) {
      return cb(err);
    }
    cb(null, cart);
  });

const findProductIndexInCart = (cart, productId) => {
  return cart.findIndex((product) => product.productId === productId);
};
module.exports = class Cart {
  // {products:[{productId,amount},...],totalPrice:0}

  static addToCart(id, price) {
    fs.readFile(cartFilePath, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (err) {
        console.log(err);
        return;
      } else if (data.length !== 0) {
        cart = JSON.parse(data);
      }
      let existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      let updatedProduct;
      if (existingProductIndex >= 0) {
        const existingProduct = cart.products[existingProductIndex];
        updatedProduct = {
          ...existingProduct,
          quantity: +existingProduct.quantity + 1,
        };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products.push(updatedProduct);
      }
      cart.totalPrice = Number(cart.totalPrice) + Number(price);
      console.log({ cart });
      fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
        if (err) {
          console.log("write to file error: ", err);
        }
      });
    });
  }
  //   static getCart(cb) {
  //     getCart(cb);
  //   }

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
