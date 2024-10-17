const router = require("express").Router();

const {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  editUserProfile,
} = require("../controllers/users");
const auth = require("../middleware/auth");

const { validateUserId } = require("../utils/validators");
/*
router.get("/users", getUsers);

router.get("/users/:userId", validateUserId, getUser);

router.post("/users", createUser);
*/

/*
router.use(auth);
*/

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, editUserProfile);

module.exports = router;
