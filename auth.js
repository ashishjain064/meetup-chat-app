const passport = require("passport");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var newFirst = "";
var sendNewFirst = "";

module.exports = function (app, myDataBase) {
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

  // LocalStrategy not currently in use

  passport.use(
    new LocalStrategy(function (username, password, done) {
      newFirst = "";
      myDataBase.findOne({ username: username }, function (err, user) {
        //console.log(`${user} tried to login`); //user login try
        if (err) {
          // console.log("Invalid username or password");
          return done(err);
        }
        if (!user) {
          // console.log("Invalid username or password");
          return done(null, false);
        }
        if (password != user.password) {
          // console.log("Invalid username or password");
          return done(null, false);
        }
        firstName = user.firstname;
        newFirst = user.firstname;
        module.exports.sendNewFirst = newFirst;

        return done(null, user);
      });
    })
  );

  //google oauth2
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        myDataBase.findOne({ googleId: profile.id }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            myDataBase.insertOne(
              { googleId: profile.id, firstname: profile._json.given_name },
              function (err, user) {
                if (err) {
                  return done(err);
                }
                return done(null, user);
              }
            );
            checkFirst = profile._json.given_name
            newFirst = user.firstname;
            module.exports.sendNewFirst = newFirst;
          }
          newFirst = user.firstname;
          module.exports.sendNewFirst = newFirst;
          return done(null, user);
        });
      }
    )
  );
};
