const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");

// Config
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res, next) => {
  res.status(404).send("Page not found!");
});

// Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running");
});
