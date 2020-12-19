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
  User.find({beHired: 1}).lean().then((users) => {
    res.render("hire", {users: users});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

router.get("/behired", (req, res) => {
  res.render("behired");
});

router.post("/behired", (req, res) => {
  User.findOne(req.user).then((user) => {
    if (user.birth && user.contact && user.gender && user.nacionality && user.profession) {
      user.beHired = "1"

      user.save().then(() => {
        req.flash("success_msg", "You have been registered to be hired");
        res.redirect("/");
      }).catch((err) => {
        req.flash("error_msg", "That's an error");
        res.redirect("/");
      });
    } else {
      req.flash("error_msg", "You have to complete your profile before register to be hired");
      res.redirect("/");
    };
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

module.exports = router;
