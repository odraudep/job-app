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

module.exports = router;
