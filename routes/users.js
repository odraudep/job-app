const router = require("express").Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
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

router.get("/profile", (req, res) => {
  User.findOne(req.user).lean().then((user) => {
    res.render("users/profile", {user: user});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

router.get("/profile/update/:id", (req, res) => {
  User.findOne({_id: req.params.id}).lean().then((user) => {
    let male = false;
    let female = false;
    if (user.gender == "M") {
      male = true
    } else {
      female = true
    }
    res.render("users/update", {user: user, male: male, female: female});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/");
  });
});

router.post("/profile/update", (req, res) => {
  User.findOne({_id: req.body.id}).then((user) => {
    user.birth = req.body.birth;
    user.gender = req.body.gender;
    user.nacionality = req.body.nacionality;
    user.profession = req.body.profession;
    user.contact = req.body.contact;

    user.save().then(() => {
      req.flash("success_msg", "You have been updated your profile");
      res.redirect("/users/profile");
    }).catch((err) => {
      req.flash("error_msg", "That's an error to update your profile");
      res.redirect("/users/profile");
    });
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/users/profile");
  });
});

router.get("/profile/changep/:id", (req, res) => {
  User.findOne({_id: req.params.id}).lean().then((user) => {
    res.render("users/changepas", {user: user});
  }).catch((err) => {
    req.flash("error_msg", "That's an error");
    res.redirect("/users/profile");
  });
});

router.post("/profile/changep/", (req, res) => {
  let password = req.body.password;
  let new_password = req.body.new_password;
  let rep_password = req.body.rep_password;

  let errors = [];

  if (!password) {
    errors.push({err_inf: "Type your password"});
  };
  if (!new_password) {
    errors.push({err_inf: "Type a new password"});
  };
  if (!rep_password) {
    errors.push({err_inf: "Repeat your password"});
  };
  if(new_password && rep_password && new_password != rep_password) {
    errors.push({err_inf: "The passwords have to be the same"});
  };

  // Check the errors
  if (errors.length > 0) {
    User.findOne({_id: req.body.id}).lean().then((user) => {
      res.render("users/changepas", {errors: errors, user: user});
    }).catch((err) => {
      req.flash("error_msg", "That's an error");
      res.redirect("/users/profile");
    });
  } else {
    User.findOne({_id: req.body.id}).then((user) => {
      bcrypt.compare(password, user.password, (err, ok) => {
        if (ok) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(new_password, salt);

          user.password = hash;

          user.save().then(() => {
            req.logOut();
            req.flash("success_msg", "Password has been changed");
            res.redirect("/users/login");
          }).catch((err) => {
            req.flash("error_msg", "That's an error to save the alterations");
            res.redirect("/users/profile");
          });
        } else {
          req.flash("error_msg", "Password incorrect");
          res.redirect("/users/profile");
        };
      });
    }).catch((err) => {
      req.flash("error_msg", "That's an error");
      res.redirect("/users/profile");
    });
  }
});

module.exports = router;
