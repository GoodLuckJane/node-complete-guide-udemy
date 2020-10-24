const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const { Product, Cart, User } = require("./models");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// User and Cart: one-to-one
User.hasOne(Cart);
Cart.belongsTo(User);

// User and Product (admin product): one-to-many
User.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(User);

// Product and Cart (shop product): many-to-many
Product.belongsToMany(Cart, { through: "product-cart" });
Cart.belongsToMany(Product, { through: "product-cart" });

// Product and Order (shop product): many-to-many

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
