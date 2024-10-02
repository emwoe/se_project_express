const router = require("express").Router();
const User = require("../models/user");

const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/:userId", getUser);

router.post("/", createUser);

module.exports = router;
