const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: undefined,
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.getById(productId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product,
    });
  });
};

exports.putEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, id } = req.body;
  console.log({ id }, req.body);
  Product.editProduct(
    {
      title,
      imageUrl,
      price,
      description,
      id,
    },
    () => {
      console.log("updatd product sucessfully");
      res.redirect(`/products/${id}`);
    }
  );
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
