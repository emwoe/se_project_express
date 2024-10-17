const clothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  console.log(req.body);

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  clothingItem
    .findById(req.params.itemId)
    .orFail()
    .then((item) => {
      const ownerId = item.owner.toString();
      if (ownerId !== req.user._id) {
        return res
          .status(403)
          .send({ message: "You are not the owner of this item." });
      }
      return clothingItem
        .findByIdAndRemove(req.params.itemId)
        .orFail(() => {
          const error = new Error("Item ID not found");
          error.statusCode = NOT_FOUND_CODE;
          error.message = "Item ID not found";
          throw error;
        })
        .then((item) => res.send({ data: item }))
        .catch((err) => {
          console.log("error type is:");
          console.log(err.name);
          if (err.name === "CastError") {
            res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
          } else if (err.statusCode === NOT_FOUND_CODE) {
            res.status(NOT_FOUND_CODE).send({ message: err.message });
          } else {
            res
              .status(DEFAULT_ERROR_CODE)
              .send({ message: "An error has occurred on the server." });
          }
        });
    });

  /*
  if (req.user._id === req.creator)
  */
  //clothingItem.find -> check owner -> clothingItem.findAndRemove
  /*
  clothingItem
    .findByIdAndRemove(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "Item ID not found";
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.log("error type is:");
      console.log(err.name);
      if (err.name === "CastError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else if (err.statusCode === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
    */
};

module.exports.likeClothingItem = (req, res) => {
  console.log(req.params);

  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "Item ID not found";
      throw error;
    })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports.unlikeClothingItem = (req, res) => {
  console.log(req.params);

  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_CODE;
      error.message = "Item ID not found";
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: "An error has occurred on the server." });
      }
    });
};
