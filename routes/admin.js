const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const {isAdmin} = require("../helpers/isAdmin");

router.get("/", isAdmin, (req, res) => {
  User.find({ _id: {$ne: req.user._id} }).sort({date: "desc"}).lean().then((users) => {
    res.render("admin/home", {users: users});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

router.post("/user/delete/:id", (req, res) => {
  User.findOneAndDelete({_id: req.params.id}).then(() => {
    req.flash("success_msg", "Deleted");
    res.redirect("/admin");
  }).catch((err) => {
    req.flash("error_msg", "Error");
    res.redirect("/admin");
  });
});

router.get("/user/admin/:id", isAdmin, (req, res) => {
  User.findOne({_id: req.params.id}).then((user) => {
    user.isAdm = 1;

    user.save().then(() => {
      req.flash("success_msg", "Alterations has been saved");
      res.redirect("/admin");
    }).catch((err) => {
      req.flash("error_msg", "That's an error to save the alterations");
      res.redirect("/admin");
    });

    req.flash("success_msg", "Updated");
    res.redirect("/admin");
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/admin");
  });
});

router.get("/user/noadmin/:id", isAdmin, (req, res) => {
  User.findOne({_id: req.params.id}).then((user) => {
    user.isAdm = 0;

    user.save().then(() => {
      req.flash("success_msg", "Alterations has been saved");
      res.redirect("/admin");
    }).catch((err) => {
      req.flash("error_msg", "That's an error to save the alterations");
      res.redirect("/admin");
    });
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/admin");
  });
});

module.exports = router;
