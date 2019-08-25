export {};
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const keys = require("../../keys/conf.json");
const User = require("../models/users");

interface user_info {
  id: string;
  provider: string;
  name: string;
}

passport.serializeUser(function(user: user_info, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function(id: string, done: any) {
  User.findOne(
    {
      id
    },
    (error: string, user: user_info) => {
      if (error) {
        return done(error);
      }
      return done(null, user);
    }
  );
});

function checkOrSaveUser(user_info: user_info, done: any) {
  User.findOne(
    {
      id: user_info.id
    },
    (error: string, user: user_info) => {
      if (error) {
        return done(error);
      }

      if (user) {
        return done(null, user);
      }

      let new_user = new User();
      new_user.id = user_info.id;
      new_user.provider = user_info.provider;
      new_user.name = user_info.name;
      new_user.save((error: string, user: user_info) => {
        if (error) {
          return done(error);
        }

        return done(null, user);
      });
    }
  );
}

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: keys.google_oauth_clientID,
      clientSecret: keys.google_oauth_clientSecret,
      callbackURL: "/api/user/google/auth/redirect"
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      let user = {
        id: profile.id,
        provider: profile.provider,
        name: profile.displayName
      };

      checkOrSaveUser(user, done);
    }
  )
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: keys.facebook_oauth_clientID,
      clientSecret: keys.facebook_oauth_clientSecret,
      callbackURL: "/api/user/facebook/auth/redirect"
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      let user = {
        id: profile.id,
        provider: profile.provider,
        name: profile.displayName
      };

      checkOrSaveUser(user, done);
    }
  )
);
