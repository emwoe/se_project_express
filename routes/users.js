const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

const { validateUserId } = require("../utils/validators");
/*
router.get("/users", getUsers);

router.get("/users/:userId", validateUserId, getUser);

router.post("/users", createUser);
*/

module.exports = router;
