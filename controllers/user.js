const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    // automatic login after signup
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome - Wanderlust Web");
      let redirectUrl = res.locals.redirectUrl || "/listing?cat=All";
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    let redirectUrl = res.locals.redirectUrl || "/listing?cat=All";
    res.redirect(redirectUrl);
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust Web");
  let redirectUrl = res.locals.redirectUrl || "/listing?cat=All";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out Successfully!");
    res.redirect("/listing?cat=All");
  });
};
