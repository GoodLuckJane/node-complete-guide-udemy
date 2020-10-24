const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const { Product, Cart, User, Order, CartItem, OrderItem } = require("./models");

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

// User and Product (admin product): one-to-many
User.hasMany(Product, { onDelete: "CASCADE" });

// Product and Cart (shop product): many-to-many
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

// User and Order
User.hasMany(Order);

// Product and Order (shop product): many-to-many
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });
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
