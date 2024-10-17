const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err.name);
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUser = (req, res) => {
  console.log(req.params);
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "User ID not found";
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log("error type is:");
      console.log(err.name);
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

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(req.body.email === undefined);
  User.findOne({ email })
    .then((user) => {
      if (user && req.body.email != undefined) {
        return Promise.reject(new Error("Email already registered"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash,
      });
    })
    .then((newUser) => {
      res.status(201).send({ name, avatar, email });
    })
    .catch((err) => {
      if (err.message === "Email already registered") {
        return res.status(409).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err.message);
      if (
        err.name === "ValidationError" ||
        err.name === "CastError" ||
        err.name === "ReferenceError" ||
        err.message.includes("undefined")
      ) {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else {
        res.status(401).send({ message: err.message });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log(req.user, req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

module.exports.editUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, avatar: avatar },
    { new: true }
  )
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
