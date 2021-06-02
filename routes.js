// const { profile } = require("console");
// const express = require("express");
// const app = require("express")();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const passport = require("passport");
const { firstName } = require("./server");
const sendNewFirst = require("./auth");

module.exports = function (app, myDataBase) {
  // working login
  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/profile");
      }
    );

  //register
  app.route("/register").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          console.log(err); //
        } else if (user) {
          res.redirect("/");
        } else {
          myDataBase.insertOne(
            {
              username: req.body.username,
              password: req.body.password,
              firstname: req.body.firstname,
            },
            (err, doc) => {
              if (err) {
                res.redirect("/");
              } else {
                // The inserted document is held within
                // the ops property of the doc
                next(null, doc.ops[0].username);
                console.log("38"); //
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/");
    }
  );

  app.get("/profile", (req, res) => {
    res.render(
      __dirname + "/profile/profile.pug"
      // { fn: firstname || rt }
      // gid2: gid,
    );
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

  app.get("/require.js", (req, res) => {
    res.sendFile(__dirname + "/chat/require.js");
  });

  app.get("/chatdom.js", (req, res) => {
    res.sendFile(__dirname + "/chatdom.js");
  });

  app.get("/profiledom.js", (req, res) => {
    res.sendFile(__dirname + "/profile/profiledom.js");
  });

  app.get("/server.js", (req, res) => {
    res.sendFile(__dirname + "/server.js");
  });

  app.get("/emojiPicker.js", (req, res) => {
    res.sendFile(__dirname + "/chat/emojiPicker.js");
  });

  app.get("/profile?sinterest=sports", (req, res) => {
    res.render(__dirname + "/chat/chat.pug", { fn: firstName });
  });

  app.get("/music-chat", (req, res) => {
    res.render(__dirname + "/chat/music/music-chat.pug", {
      fn: sendNewFirst.sendNewFirst});
    // console.log("route 67"); //
  });

  app.get("/sports-chat", (req, res) => {
    res.render(__dirname + "/chat/sports/sports-chat.pug", { fn: sendNewFirst.sendNewFirst});
    console.log("route 67"); //
  });

  app.get("/tech-chat", (req, res) => {
    res.render(__dirname + "/chat/tech/tech-chat.pug", { fn: sendNewFirst.sendNewFirst});
    console.log("route 67"); //
  });

  //react
  app.get("/react-typing.js", (req, res) => {
    res.sendFile(__dirname + "/chat/react-typing.js");
  });

  function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
