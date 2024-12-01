const clothingItem = require("../models/clothingItem");

/*
const {
  VALIDATION_ERROR_CODE,
  NO_MATCH_CODE,
  NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,/
} = require("../utils/errors");
 */

const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

module.exports.getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  console.log(req.body);

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id, likes: [] })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Validation Error: Ensure all fields are filled correctly.",
        });
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  console.log(req.params.id);
  clothingItem
    .findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError("Item ID not found.");
    })
    .then((item) => {
      const ownerId = item.owner.toString();
      if (ownerId !== req.user._id) {
        throw new ForbiddenError("You are not the owner of this item.");
      }
      return clothingItem
        .findByIdAndRemove(req.params.id)

        .then(() => res.send({ data: item }));
    })
    .catch((err) => {
      console.log("error type is:");
      console.log(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Something isn't formatted correctly."));
      } else if (err.statusCode === 404) {
        next(new NotFoundError("Item ID not found."));
      } else {
        next(err);
      }
    });
};

module.exports.likeClothingItem = (req, res, next) => {
  console.log(req.params.id);
  console.log(req.user._id);

  clothingItem
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError("Item ID not found.");
    })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError("Item ID not found."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Something isn't formatted correctly."));
      } else {
        next(err);
      }
    });
};

module.exports.unlikeClothingItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new NotFoundError("Item ID not found");
    })
    .then((item) => res.send({ item }))
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError("Item ID not found."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Something isn't formatted correctly."));
      } else {
        next(err);
      }
    });
};
