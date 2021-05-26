const express = require("express");
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const pug = require("pug");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const myDB = require("./connection");
const routes = require("./routes");
const auth = require("./auth");
(global.gid = ""), (global.firstName = "");

// app.use(express.static(__dirname + "/public"));
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
  res.render(__dirname + "/homepage/index.pug");
});

app.get("/public/hey.jpg", (req, res) => {
  res.sendFile(__dirname + "/public/hey.jpg");
});

// db async
myDB(async (client) => {
  const myDataBase = await client.db("databse").collection("users");

  //both files
  routes(app, myDataBase);
  auth(app, myDataBase);

  app.get("/chat", (req, res) => {
    res.render(__dirname + "/chat/chat.pug", { fn: firstName });
  });

  io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
      io.emit("chat message", firstName + ": " + msg);
    });
  });

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
});

module.exports = { firstName };

server.listen(3000, () => {
  console.log("app listening on 3000"); //listening
});
