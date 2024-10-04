const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

const { validateItemId } = require("../utils/validators");

router.get("/items", getClothingItems);

router.post("/items", createClothingItem);

router.delete("/items/:itemId", validateItemId, deleteClothingItem);

router.put("/items/:itemId/likes", validateItemId, likeClothingItem);

router.delete("/items/:itemId/likes", validateItemId, unlikeClothingItem);

module.exports = router;
