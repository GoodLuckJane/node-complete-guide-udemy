const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProduct = (req, res, next) => {
  Product.getById(req.params.productId)
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

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, id } = req.body;
  Product.editById(id, { title, imageUrl, price, description })
    .then(() => {
      res.redirect(`/products/${id}`);
    })
    .catch(() => {
      res.redirect("/");
    });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  Product.addItem({ title, imageUrl, price, description })
    .then(() => {
      console.log("product added");
      res.redirect("/");
    })
    .catch((err) => {
      console.log("add item error", err);
      res.redirect("/");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(() => {
      res.redirect("/admin/products");
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      console.log({ products });
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
