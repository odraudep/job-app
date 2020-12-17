const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

//-----Config
// Middleware
app.use(session({
  secret: "jobapp",
  resave: true,
  saveUninitialized: true
  // cookie: {secure: true}
}));
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})

// Path
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//-----Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/html/404.html");
});

//------Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running");
});
