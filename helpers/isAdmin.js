module.exports = {
  isAdmin: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "You have to be an admin to can enter on this page");
      res.redirect("/");
    };
  }
}
