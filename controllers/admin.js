const { Product, Order, OrderItem, CartItem } = require("../models");
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProduct = (req, res) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
      });
    })
    .catch(() => {
      res.redirect("/");
    });
};

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body;
  Product.update({ title, imageUrl, price, description }, { where: { id } })
    .then(() => {
      res.redirect(`/products/${id}`);
    })
    .catch((err) => {
      console.log("edit product", err);
      res.redirect("/");
    });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  let user = req.user;
  console.log({ title, imageUrl, price, description });
  // let product = Product.addProduct({ title, imageUrl, price, description });
  user
    .createProduct({ title, imageUrl, price, description })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("add product to user error", err);
      res.redirect("/");
    });
};

exports.postDeleteProduct = (req, res) => {
  Product.findByPk(req.body.id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(() => {
      res.redirect("/admin/products");
    });
};

exports.getProducts = (req, res) => {
  let user = req.user;
  user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch(() => {
      res.redirect("/admin/products");
    });
};

exports.getOrderDetails = async (req, res) => {
  try {
    let orderId = req.query.orderId;
    let itemsInOrder = [];
    let totalPrice = 0;
    if (orderId) {
      itemsInOrder = await req.user.getOrders({
        where: { id: orderId },
        include: Product,
      });
      itemsInOrder = itemsInOrder[0].products;
      if (itemsInOrder.length > 0) {
        itemsInOrder.forEach((product) => {
          totalPrice = totalPrice + product.price * product.orderItem.quantity;
        });
      }
    } else {
      // from cart
      let cart = await req.user.getCart({ include: Product });
      if (cart) {
        // add all these products and quantity to orders
        const newOrder = await req.user.createOrder({ status: "unpaid" });
        await newOrder.addProducts(
          cart.products.map((product) => {
            let quantity = product.cartItem.quantity;
            product.orderItem = { quantity };
            totalPrice = totalPrice + quantity * product.price;
            return product;
          })
        );
        itemsInOrder = await newOrder.getProducts();
        // set cart to be empty
        await req.cart.setProducts(null);
      }
    }
    res.render("admin/order-details.ejs", {
      order: itemsInOrder,
      pageTitle: "Your Order",
      totalPrice,
      path: "/admin/orderDetails",
    });
  } catch (err) {
    console.log("get order details page error: ", err);
    res.redirect("/cart");
  }
};

exports.cancelOrder = async (req, res) => {
  console.log(req);
  res.redirect("/");
};

exports.postCheckout = async (req, res) => {
  console.log(req);
  res.redirect("/");
};
