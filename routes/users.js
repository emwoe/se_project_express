const router = require("express").Router();

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
