const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    throw new BadRequestError("Email is required");
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
      () => res.status(201).send({ name, avatar, email }) // no return
    )
    .catch((err) => {
      console.error();
      if (err.message === "Email already registered") {
        next(new ConflictError("Email already registered"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Please enter a properly formatted email."));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Both email and password are required.");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const usertoken = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const userdata = {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };

      res.send({ userdata, usertoken });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password.") {
        next(new UnauthorizedError("Incorrect email or password."));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  console.log("Current user is");
  console.log(req.user, req.user._id);
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User ID not found.");
    })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        next(new NotFoundError("User not found."));
      } else {
        next(err);
      }
    });
};

module.exports.editUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, avatar: avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User ID not found.");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError("Could not update with information provided.")
        );
      } else if (err.statusCode === 404) {
        next(new NotFoundError("User not found."));
      } else {
        next(err);
      }
    });
};
