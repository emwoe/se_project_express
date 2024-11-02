const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_CODE,
  DUPLICATE_CODE,
  UNAUTH_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "No email provided" });
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new Error("Email already registered"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then(
      () =>
        // (newUser)
        res.status(201).send({ name, avatar, email }) // no return
    )
    .catch((err) => {
      if (err.message === "Email already registered") {
        return res.status(DUPLICATE_CODE).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "Both email and password are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const usertoken = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const userdata = user;
      res.send({ userdata, usertoken });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === "Incorrect email or password") {
        res.status(UNAUTH_CODE).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log("Current user is");
  console.log(req.user, req.user._id);
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "Item ID not found";
      throw error;
    })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
      }
    });
};

module.exports.editUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "User ID not found";
      throw error;
    })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else if (err.statusCode === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
