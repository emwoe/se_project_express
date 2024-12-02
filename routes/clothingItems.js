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

router.post("/items", validateCardBody, auth, createClothingItem);

router.delete("/items/:id", validateID, auth, deleteClothingItem);

router.put("/items/:id/likes", validateID, auth, likeClothingItem);

router.delete("/items/:id/likes", validateID, auth, unlikeClothingItem);

module.exports = router;
