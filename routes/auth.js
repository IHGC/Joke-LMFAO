const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username
  const password = req.body.password;


  if (email === "" || username === "" || password === "") {
    res.render("auth/signup", { message: "Missing credentials" });
    return;
  }
  
  if(username.indexOf("@")>-1){
    res.render("auth/signup",{message: "Invalid username"})
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    User.findOne({ email }, "email", (err, user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The email already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          res.redirect("/auth/login");
        })
        .catch(err => {
          res.render("auth/signup", { message: "Something went wrong" });
        })
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;




