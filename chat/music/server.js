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
(global.gid = ""), (global.firstName = "" || "newp");

app.use(express.static("public"));

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

app.get("/register", (req, res) => {
  res.render(__dirname + "/register/register.pug");
});

app.get("/public/hey.jpg", (req, res) => {
  res.sendFile(__dirname + "/public/hey.jpg");
});

app.get("/public/g.png", (req, res) => {
  res.sendFile(__dirname + "/public/g.png");
});


// db async
myDB(async (client) => {
  const myDataBase = await client.db("databse").collection("users");

  module.exports = firstName;
  //both files
  routes(app, myDataBase);
  auth(app, myDataBase);

  app.get("/chat", (req, res) => {
    res.render(__dirname + "/chat/chat.pug", { fn: firstName });
    console.log("server 60"); //
  });

  // app.get("/profile?sinterest=sports", (req, res) => {
  //   res.render(__dirname + "/chat/chat.pug", { fn: firstName });
  // });

  io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
      io.emit("chat message", firstName + ": " + msg);
    });
  });

  io.on("connection", (socket) => {
    socket.on("typing", (typingmsg) => {
      io.emit("typing", firstName + " " + typingmsg);
    });
  });

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
});

server.listen(3000, () => {
  console.log("app listening on 3000"); //listening
});
