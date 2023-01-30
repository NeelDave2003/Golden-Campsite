const express = require("express");
const passport = require("passport");
const { authenticate } = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const userControllers = require("../controllers/usersControllers");

router
  .route("/register")
  .get(userControllers.register)
  .post(catchAsync(userControllers.registerpostrequest));

router
  .route("/login")
  .get(userControllers.login)

  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    userControllers.loginpostrequest
  );
router.get("/logout", userControllers.logout);
module.exports = router;
