const {
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/product");
exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProduct = (req, res) => {
  getProductById(req.params.productId)
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
  updateProduct(id, { title, imageUrl, price, description })
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
  deleteProduct(req.body.id)
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
