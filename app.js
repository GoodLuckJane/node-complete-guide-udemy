const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const { Product, Cart, User, Order } = require("./models");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(async (req, res, next) => {
  try {
    let user = await User.findByPk(1);
    let cart = await user.getCart();
    req.user = user;
    req.cart = cart;
    next();
  } catch (err) {
    console.log(err);
  }
});
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

// User and Order
User.hasMany(Order);
Order.belongsTo(User);
// Product and Order (shop product): many-to-many
Product.belongsToMany(Order, { through: "orderItem" });
Order.belongsToMany(Product, { through: "orderItem" });
sequelize
  .sync()
  .then(() => {
    return Promise.all([User.findByPk(1), Cart.findByPk(1)]);
  })
  .then(([user, cart]) => {
    let promises = [];
    if (!user) {
      promises.push(
        User.create({
          name: "Jane Zhang",
          email: "jane.zhang@fintelics.com",
        })
      );
    }
    if (!cart) {
      promises.push(Cart.create({ id: 1, userId: 1 }));
    }
    return Promise.all(promises);
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
