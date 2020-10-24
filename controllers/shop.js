const Product = require("../services/product");
const { ProductCart } = require("../models");

exports.getProducts = (req, res) => {
  Product.getProductList()
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

exports.getProductDetails = (req, res) => {
  Product.getProductById(req.params.productId)
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

exports.getIndex = (req, res) => {
  Product.getProductList()
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

exports.getCart = async (req, res) => {
  try {
    let cart = req.cart;
    let cartProductList = await cart.getProducts();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      cart: cartProductList,
    });
  } catch (err) {
    res.redirect("/");
  }
};
exports.postCart = async (req, res) => {
  const { productId } = req.body;
  try {
    let newProduct = await Product.getProductById(productId);
    let cart = req.cart;
    let productInCart = await cart.getProducts({ where: { id: productId } });
    if (productInCart.length > 0) {
      await cart.addProduct(productInCart[0], {
        through: { quantity: productInCart[0]["product-cart"].quantity + 1 },
      });
    } else {
      await cart.addProduct(newProduct, { through: { quantity: 1 } });
    }
  } catch (err) {
    console.log({ err: err });
  } finally {
    res.redirect("/cart");
  }
};
exports.clearCart = async (req, res) => {
  let cart = req.cart;
  await cart.setProducts([]);
  res.redirect("/cart");
};
exports.deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = req.cart;
    let product = await Product.getProductById(productId);
    await cart.removeProduct(product);
  } catch (err) {
    console.log("delete cart item error: ", err);
  } finally {
    res.redirect("/cart");
  }
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
