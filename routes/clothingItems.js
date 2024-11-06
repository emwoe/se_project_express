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

router.get("/items", getClothingItems);

/*
router.use(auth);
*/

router.post("/items", auth, createClothingItem);

router.delete("/items/:id", validateItemId, auth, deleteClothingItem);

router.put("/items/:id/likes", validateItemId, auth, likeClothingItem);

router.delete("/items/:id/likes", validateItemId, auth, unlikeClothingItem);

module.exports = router;
