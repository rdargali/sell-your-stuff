const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

//mustache express
const VIEWS_PATH = path.join(__dirname, "/views");
const mustacheExpress = require("mustache-express");
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials"), ".mustache");
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
