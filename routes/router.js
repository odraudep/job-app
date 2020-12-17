const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  User.find().lean().then((users) => {
    res.render("home", {users: users});
  }).catch((err) => {
    req.send("error to find the users");
  });
});

router.get("/logout", (req, res) => {
  req.logOut();

  req.flash("success_msg", "You have logged out of your account");
  res.redirect("/");
});

module.exports = router;
