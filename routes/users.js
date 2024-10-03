const router = require("express").Router();
const User = require("../models/user");

const {
  validateId,
  getUsers,
  getUser,
  createUser,
} = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", validateId, getUser);

router.post("/users", createUser);

module.exports = router;
