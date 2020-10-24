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
    let productCartList = await ProductCart.findAll();
    const productsInCart = cartProductList.map((product) => {
      let productCartItem = productCartList.find(
        (item) => item.productId === product.id
      );
      return { ...product.dataValues, quantity: productCartItem.quantity };
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
exports.postCart = async (req, res) => {
  const { productId } = req.body;
  try {
    let product = await Product.getProductById(productId);
    let cart = req.cart;
    const isItemInCart = await cart.hasProduct(product);
    if (isItemInCart) {
      let productCart = await ProductCart.findOne({
        where: { cartId: cart.id },
      });
      console.log("the item in ProductCart table: ", productCart);
      await productCart.update(
        { quantity: productCart.quantity + 1 },
        { where: { cartId: cart._id } }
      );
    } else {
      await ProductCart.create({
        productId,
        cartId: cart.id,
        quantity: 1,
      });
    }
  } catch (err) {
    console.log({ err: err.errors });
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
