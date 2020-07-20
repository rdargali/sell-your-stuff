const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

global.__basedir = __dirname;

//static resources
app.use("/uploads", express.static("uploads"));
app.use("/css", express.static("css"));

//express session
const session = require("express-session");
app.use(
  session({
    secret: "something super super secrit guys",
    resave: true,
    saveUninitialized: false,
  })
);

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

//routes and middleware

const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

const usersRouters = require("./routes/users");
app.use("/users", usersRouters);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
