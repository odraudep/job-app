const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  let errors = [];

  // Errors
  if (!name) {
    errors.push({err_inf: "Type a name"});
  }
  if (!email) {
    errors.push({err_inf: "Type a email"});
  }
  if (!password) {
    errors.push({err_inf: "Type a password"});
  }
  if (!password2) {
    errors.push({err_inf: "Repeat your password"});
  }
  if(password && password2 && password != password2) {
    errors.push({err_inf: "The passwords have to be the same"});
  }

  // Check the errors
  if (errors.length > 0) {
    res.render("register", {errors: errors, name: name, email: email, password: password});
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hash
    }).save().then(() => {
      req.flash("success_msg", "You have been registered");
      res.redirect("/")
    }).catch((err) => {
      req.flash("error_msg", "That's an error");
      res.redirect("/");
    });
  }
})

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  req.flash("success_msg", "You have been logged")
  res.redirect("/");
})

router.get("/delete/:id", (req, res) => {
  User.findOneAndDelete({_id: req.params.id}).then(() => {
    req.flash("success_msg", "Deleted");
    res.redirect("/");
  }).catch((err) => {
    req.flash("error_msg", "Error");
    res.redirect("/");
  });
});

module.exports = router;
