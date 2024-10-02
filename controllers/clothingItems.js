const clothingItem = require("../models/clothingItem");

module.exports.getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.deleteClothingItem = (req, res) => {
  if (!items[req.params.id]) {
    res.send(`This user doesn't exist`);
    return;
  }
  clothingItem
    .findByIdAndRemove(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};
