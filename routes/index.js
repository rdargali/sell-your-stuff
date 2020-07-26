const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const models = require("../models");

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      } else {
        res.redirect("/login");
      }
    });
  }
});

router.post("/add-comment", async (req, res) => {
  let productId = parseInt(req.body.productId);
  let title = req.body.title;
  let description = req.body.description;

  let comment = models.Comment.build({
    title: title,
    description: description,
    productId: productId,
  });

  let savedComment = await comment.save();

  if (savedComment) {
    res.redirect(`/products/${productId}`);
  } else {
    res.render("prodyct-details", { message: "Error adding comment!" });
  }
});

router.get("/products/:productId", async (req, res) => {
  let productId = parseInt(req.params.productId);
  let product = await models.Product.findOne({
    include: [
      {
        model: models.Comment,
        as: "comments",
      },
    ],
    where: {
      id: productId,
    },
  });

  res.render("product-details", product.dataValues);
});

router.get("/", async (req, res) => {
  let products = await models.Product.findAll();

  res.render("index", { products: products });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let user = await models.User.findOne({
    where: {
      username: username,
    },
  });

  if (user != null) {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = {
            userId: user.id,
          };

          res.redirect("/users/products");
        }
      } else {
        res.render("login", { message: "Incorrect username or password" });
      }
    });
  } else {
    res.render("login", { message: "Incorrect username or password" });
  }
});

module.exports = router;
