const User = require("../models/user");

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
  console.log("Checking for existing user email...");

  User.findOne({ email }).then((user) => {
    if (user) {
      console.log("User found. Rejecting...");
      return Promise.reject(new Error("Email already exists"));
    }
    console.log("No user found. Creating new user...");
    return User.create({ name, avatar, email, password })
      .then((newUser) => res.status(201).send({ data: newUser }))
      .catch((err) => {
        console.log("Error caught", err);

        if (err.message === "Email already registered.") {
          return res.status(409).send({ message: err.message });
        } else if (err.name === "ValidationError") {
          res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
        } else {
          res
            .status(DEFAULT_ERROR_CODE)
            .send({ message: "An error has occurred on the server." });
        }
      });
  });
};
