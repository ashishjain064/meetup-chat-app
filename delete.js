const express = require("express");
const app = express();
const myDB = require("./connection");
const pug = require("pug");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");

app.use(express.static(__dirname + "/public"));
// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.get("/", (req, res) => {
  console.log("qw"); //
  res.render(__dirname + "/index.pug");
});

app.get("/hey.jpg", (req, res) => {
  console.log("tr"); //tr
  res.sendFile(__dirname + "/hey.jpg");
});

// db async
myDB(async (client) => {
  const myDataBase = await client.db("databse").collection("users");

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }, (req, res) => {
      console.log("test");
      res.render("profile.pug");
    })
  );

  app.get("/profile", ensureAuth, (req, res) => {
    res.render("profile.pug", { username: req.body.username });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      myDataBase.findOne()({ username: username }, function (err, user) {
        console.log(`${user} tried to login`); //user login try
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (password != user.password) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new Object(id) }, (err, doc) => {
      if (err) {
        return done(" ", err);
      }
      done(null, doc);
    });
  });
}).catch((e) => {
  app.get("/", (req, res) => {
    res.send(e);
  });
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.listen(3000, () => {
  console.log("app listening on 3000"); //listening
});
