const Product = require("../services/product");
const { Cart, User, ProductCart } = require("../models");
const getUserAndCart = async () => {
  try {
    // get current user
    // if user doesn't exists, create one
    let user = await User.findAll();
    if (user.length === 0) {
      await User.create({
        name: "Jane Zhang",
        email: "jane.zhang@fintelics.com",
      });
      user = await User.findAll();
    }
    user = user[0];

    let cart = await user.getCart();
    if (!cart) {
      // if cart doesn't exists, create one
      cart = await user.createCart({ id: 1 });
      // cart = await user.getCart();
    }
    return { user, cart };
  } catch (err) {
    console.log("get user and cart error: ", err);
    throw err;
  }
};
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
  try {
    let { cart } = await getUserAndCart();
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
exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  try {
    let product = await Product.getProductById(productId);
    let { cart } = await getUserAndCart();
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
exports.clearCart = async (req, res, next) => {
  const { cart } = await getUserAndCart();
  await cart.setProducts([]);
  res.redirect("/cart");
};
exports.deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { cart } = await getUserAndCart();
    let product = await Product.getProductById(productId);
    await cart.removeProduct(product);
  } catch (err) {
    console.log("delete cart item error: ", err);
  } finally {
    res.redirect("/cart");
  }
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
