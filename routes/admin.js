const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const {isAdmin} = require("../helpers/isAdmin");

router.get("/", isAdmin, (req, res) => {
  User.find().lean().then((users) => {
    res.render("admin/home", {users: users});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

module.exports = router;
