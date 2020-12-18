const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  User.findOne(req.user).lean().then((cuser) => {
    res.render("home", {cuser: cuser});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

router.get("/logout", (req, res) => {
  req.logOut();

  req.flash("success_msg", "You have logged out of your account");
  res.redirect("/");
});

router.get("/hire", (req, res) => {
  User.find().lean().then((users) => {
    res.render("hire", {users: users});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

module.exports = router;
