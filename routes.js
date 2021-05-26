const { profile } = require("console");
const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const passport = require("passport");
const { firstName } = require("./server");

module.exports = function (app, myDataBase) {
  // app.post(
  //   "/login",
  //   passport.authenticate("local", { failureRedirect: "/" }, (req, res) => {
  //     res.render("profile.pug");
  //   })
  // );

  app.get("/profile", ensureAuth, (req, res) => {
    res.render("profile.pug", { gid: profile.googleId, gid2: gid });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  //google oauth routes
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
      res.render(__dirname + "/profile/profile.pug"); //, {gid: user.googleId,
      // gid2: gid,
    }
  );

  // app.get("/chat", (req, res) => {
  //   res.render(__dirname + "/chat/chat.pug", { fn: firstName });
  // });

  function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
