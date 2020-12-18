const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
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
  };
  if (!email) {
    errors.push({err_inf: "Type an email"});
  };
  User.findOne({email: email}).then((user) => {
    if (user) {
      errors.push({err_inf: "Already exists an account using this email"});
    }
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
  if (!password) {
    errors.push({err_inf: "Type a password"});
  };
  if (!password2) {
    errors.push({err_inf: "Repeat your password"});
  };
  if(password && password2 && password != password2) {
    errors.push({err_inf: "The passwords have to be the same"});
  };

  console.log(errors)
  // Check the errors
  if (errors.length > 0) {
    res.render("users/register", {errors: errors, name: name, email: email, password: password});
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
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
