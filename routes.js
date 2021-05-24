const { profile } = require("console");
const express = require("express");
const app = express();
const passport = require("passport");
// const http = require(http);
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

module.exports = function (app, myDataBase) {
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }, (req, res) => {
      console.log("test");
      res.render("profile.pug");
    })
  );

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
      res.render(__dirname + "/profile.pug"); //, {gid: user.googleId,
      // gid2: gid,
    }
  );

  app.get("/chat", (req, res) => {
    res.render(__dirname + "/chat.pug");
  });

  // io.on("connection", (socket) => {
  //   socket.on("chat message", (msg) => {
  //     io.emit("chat message", msg);
  //   });
  // });
  // );

  function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
