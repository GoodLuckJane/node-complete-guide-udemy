const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch(() => {
      res.render("shop/product-list", {
        prods: [],
        pageTitle: "All Products",
        path: "/products",
      });
    });
};

exports.getProductDetails = (req, res, next) => {
  Product.getById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail.ejs", {
        pageTitle: "Product Details",
        product,
        path: "/products",
      });
    })
    .catch(() => {
      res.redirect("/");
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(() => {
      res.render("shop/index", {
        prods: [],
        pageTitle: "Shop",
        path: "/",
      });
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then((products) => {
        const productsInCart = cart.products.map((product) => {
          let productInfo = products.find((prod) => prod.id === product.id);
          return { ...productInfo, quantity: product.quantity };
        });
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          cart: productsInCart,
        });
      })
      .catch(() => {
        res.redirect("/");
      });
  });
};
exports.postCart = (req, res, next) => {
  const { productId, productPrice, quantity } = req.body;
  Cart.addToCart(productId, productPrice, 1);
  res.redirect("/cart");
};
exports.clearCart = (req, res, next) => {
  Cart.clearCart(() => {
    res.redirect("/cart");
  });
};
exports.deleteCartItem = (req, res, next) => {
  const { productId, productPrice } = req.body;
  Cart.deleteById(productId, productPrice, () => {
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
