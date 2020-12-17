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
const admin = require("./routes/admin");
const passport = require("passport");
require("./config/auth")(passport);

//-----Config
// Middleware
app.use(session({
  secret: "jobapp",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
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
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to the MongoDB");
}).catch((err) => {
  console.log("That's an error to connect to the database");
});

//-----Routes
app.use(router)
app.use("/users", users);
app.use("/admin", admin);

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/html/404.html");
});

//------Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running");
});
