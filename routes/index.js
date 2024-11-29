const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middleware/validation");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);

module.exports = router;
