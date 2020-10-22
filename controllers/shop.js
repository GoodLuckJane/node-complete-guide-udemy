const Product = require("../services/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
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

exports.getProductDetails = (req, res, next) => {
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

exports.getIndex = (req, res, next) => {
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

exports.getCart = async (req, res, next) => {
  let cart = [];
  try {
    cart = await Cart.findAll();
    const products = await Product.getProductList();
    const productsInCart = cart.map((product) => {
      let productInfo = products.find((prod) => prod.id == product.productId);
      return { ...productInfo.dataValues, quantity: product.quantity };
    });
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      cart: productsInCart,
    });
  } catch (err) {
    res.redirect("/");
  }
};
exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const isItemInCart = await Cart.findOne({ where: { productId } });
    if (isItemInCart) {
      await Cart.update(
        {
          ...isItemInCart.dataValues,
          quantity: isItemInCart.quantity + 1,
        },
        { where: { productId } }
      );
    } else {
      await Cart.create({ productId, quantity: 1 });
    }
  } catch (err) {
    console.log({ err });
  } finally {
    res.redirect("/cart");
  }
};
exports.clearCart = async (req, res, next) => {
  Cart.findAll()
    .then((carts) => {
      carts.forEach((cart) => cart.destroy());
    })
    .then(() => res.redirect("/cart"));
};
exports.deleteCartItem = async (req, res, next) => {
  const { productId } = req.body;
  await Cart.destroy({ where: { productId } });
  res.redirect("/cart");
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
