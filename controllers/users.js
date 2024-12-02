const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

/*
const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_CODE,
  DUPLICATE_CODE,
  UNAUTH_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");
 */

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

//  The function below no longer works if don't send the userdata back //

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
      const userdata = user;

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

//  Variables below (newName & newImageUrl) match frontend request, but are saved as name/avatar here

module.exports.editUserProfile = (req, res, next) => {
  const { newName, newImageUrl } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: newName, avatar: newImageUrl },
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
