const express = require("express");
const app = express();
const pug = require("pug");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
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

  //both files
  routes(app, myDataBase);
  auth(app, myDataBase);

  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
});

app.listen(3000, () => {
  console.log("app listening on 3000"); //listening
});
