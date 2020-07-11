const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

//bcrypt
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

//sequelize
const models = require("./models");

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//mustache express
const VIEWS_PATH = path.join(__dirname, "/views");
const mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials"), ".mustache");
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });

  if (persistedUser == null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.render("/register", { message: "Error creating user" });
      }

      let user = models.User.build({
        username: username,
        password: hash,
      });

      let savedUser = await user.save();

      if (savedUser != null) {
        res.redirect("/login");
      } else {
        res.render("/register", { message: "Username already exists" });
      }
    });
  } else {
    res.render("/register", { message: "Username already exists" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
