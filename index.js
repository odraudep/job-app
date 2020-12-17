const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./routes/router");
const users = require("./routes/users");

//-----Config
// Middleware
app.use(session({
  secret: "jobapp",
  resave: true,
  saveUninitialized: true
}));

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})

// Path
app.use(express.static(path.join(__dirname, "public")));

// Engine
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DataBase connection
mongoose.connect("mongodb://localhost/jobapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {
  console.log("Connected to the MongoDB");
}).catch((err) => {
  console.log("That's an error to connect to the database");
});

//-----Routes
app.use(router)
app.use("/users", users);

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/html/404.html");
});

//------Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running");
});
