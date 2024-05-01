const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignup) // render signup Form
  .post(saveRedirectURL, wrapAsync(userController.signUp)); //signup

router
  .route("/login")
  .get(userController.renderLogin) // render login Form
  .post(
    saveRedirectURL,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  ); //login

// logout
router.get("/logout", userController.logout);

module.exports = router;
