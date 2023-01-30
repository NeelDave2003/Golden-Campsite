const User = require("../models/user");
const Campground = require("../models/campground");

module.exports.register = (req, res) => {
  res.render("users/register");
};

module.exports.registerpostrequest = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (e) => {
      if (e) return next(e);
      req.flash("Success", "Welcome To YelpCamp :) ");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  res.render("users/login");
};

module.exports.loginpostrequest = (req, res) => {
  req.flash("Success", "Welcome Back :) ");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("Success", "Log Out SuccessFully ");
    res.redirect("/campgrounds");
  });
};
