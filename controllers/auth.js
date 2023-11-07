const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.handleSignup = (req, res, next) => {
  // regex config
  const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+@+[a-zA-Z0-9]+\.+[a-z]{2,4}$/;
  const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,24}$/;

  // verify user input
  !EMAIL_REGEX.test(req.body.email)
    ? res.status(400).json()
    : !PWD_REGEX.test(req.body.password)
    ? res.status(400).json()
    : bcrypt // hash password
        .hash(req.body.password, 10)
        .then((hash) => {
          // create user
          const user = new User({
            email: req.body.email,
            password: hash,
          });

          user
            .save()
            .then(() => res.status(201).json())
            .catch((error) => res.status(403).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.handleLogin = (req, res, next) => {
  const cookies = req.cookie;

  // set coockies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  };

  const clearOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  User.findOne({ email: req.body.email })
    .then((user) => {
      // user not authorized if his email does not saved in DB
      if (!user) return res.status(401).json();
      bcrypt
        .compare(req.body.password, user.password) // compare his password
        .then((valid) => {
          // password not valid
          // user not authorized
          if (!valid) return res.status(401).json();

          // retrieve user id and user role
          // create a new token
          const _uid = user._id;
          const _urol = Object.values(user.roles).filter(Boolean);
          const _jwt = jwt.sign({ userId: user._id }, process.env.TOKEN, {
            expiresIn: "24h",
          });

          // create a token array in DB
          let newTokenArray = !cookies?._jwt
            ? user.tokens
            : user.tokens.filter((rt) => rt !== cookies.jwt);

          if (cookies?._jwt) {
            // detected that token is re-used
            const token = cookies._jwt;
            const foundToken = User.findOne({ token }).exec();

            // add it to newTokenArray if it is not
            if (!foundToken) {
              newTokenArray = [];
            }

            // clear out all tokens if token has been re-used
            res.clearCookie("_uid", clearOptions);
            res.clearCookie("_jwt", clearOptions);
            res.clearCookie("_urol", clearOptions);
          }

          // saving RT with current user
          user.tokens = [...newTokenArray, newToken];
          user.save();

          // set cookies
          res.cookie("_uid", `${_uid}`, options);
          res.cookie("_jwt", `${_jwt}`, options);
          res.cookie("_urol", `${_urol}`, options);

          // send response ok
          res.status(200).json({ _uid, _jwt, _urol });
        })
        .catch((error) => res.status(403).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.handleLogout = (req, res, next) => {
  User.findOne({ tokens: req.body._jwt })
    .then((user) => {
      // no user id match so user not authorized
      if (!user) return res.status(401).json();

      // set cookie options
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      // clear cookies
      res.clearCookie("_uid", options);
      res.clearCookie("_jwt", options);
      res.clearCookie("_urol", options);

      // send response ok
      res.status(200).json();
    })
    .catch((error) => res.status(500).json({ error }));
};
