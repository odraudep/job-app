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

router.get("/users/delete/:id", (req, res) => {
  User.findOneAndDelete({_id: req.params.id}).then(() => {
    req.flash("success_msg", "Deleted");
    res.redirect("/admin");
  }).catch((err) => {
    req.flash("error_msg", "Error");
    res.redirect("/admin");
  });
});

module.exports = router;
