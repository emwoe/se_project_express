const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

const auth = require("../middleware/auth");

const { validateCardBody, validateID } = require("../middleware/validation");

router.get("/items", getClothingItems);

router.post("/items", auth, validateCardBody, createClothingItem);

router.delete("/items/:id", auth, validateID, deleteClothingItem);

router.put("/items/:id/likes", auth, validateID, likeClothingItem);

router.delete("/items/:id/likes", auth, validateID, unlikeClothingItem);

module.exports = router;
