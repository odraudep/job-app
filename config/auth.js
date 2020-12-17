const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");

module.exports = function(passport) {
  passport.use(new localStrategy({usernameField: "email"}, (email, password, done) => {
    User.findOne({email: email}).then((user) => {
      if (!user) {
        return done(null, false, {message: "There isn't any user with this email"});
      };

      bcrypt.compare(password, user.password, (err, ok) => {
        if (ok) {
          return done(null, user);
        } else {
          return done(null, false, {message: "Password incorrected"});
        };
      });
    });
  }));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
