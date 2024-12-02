const router = require("express").Router();

const { getCurrentUser, editUserProfile } = require("../controllers/users");
const auth = require("../middleware/auth");

const { validateUpdatedUserBody } = require("../middleware/validation");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", validateUpdatedUserBody, auth, editUserProfile);

module.exports = router;
