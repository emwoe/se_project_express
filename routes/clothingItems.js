const router = require("express").Router();

const {
  validateId,
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/items", getClothingItems);

router.post("/items", createClothingItem);

router.delete("/items/:itemId", validateId, deleteClothingItem);

router.put("/items/:itemId/likes", validateId, likeClothingItem);

router.delete("/items/:itemId/likes", validateId, unlikeClothingItem);

module.exports = router;
