const passport = require("passport");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

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

  //LocalStrategy not currently in use
  // passport.use(
  //   new LocalStrategy(function (username, password, done) {
  //     myDataBase.findOne({ username: username }, function (err, user) {
  //       console.log(`${user} tried to login`); //user login try
  //       if (err) {
  //         return done(err);
  //       }
  //       if (!user) {
  //         return done(null, false);
  //       }
  //       if (password != user.password) {
  //         return done(null, false);
  //       }
  //       return done(null, user);
  //     });
  //   })
  // );

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
            firstName = profile._json.given_name;
          }
          firstName = profile._json.given_name;
          gid = user.googleId;
          return done(null, user);
        });
      }
    )
  );
};
