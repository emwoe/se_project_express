const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

const auth = require("../middleware/auth");

const { validateItemId } = require("../utils/validators");
const { validateCardBody, validateID } = require("../middleware/validation");

router.get("/items", getClothingItems);

/*
router.use(auth);
*/

/*
router.post("/items", validateCardBody, auth, createClothingItem);
*/
router.post("/items", auth, createClothingItem);

router.delete(
  "/items/:id",
  validateID,
  validateItemId,
  auth,
  deleteClothingItem
);

router.put(
  "/items/:id/likes",
  validateID,
  validateItemId,
  auth,
  likeClothingItem
);

router.delete(
  "/items/:id/likes",
  validateID,
  validateItemId,
  auth,
  unlikeClothingItem
);

module.exports = router;
