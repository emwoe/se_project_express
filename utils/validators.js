const { VALIDATION_ERROR_CODE } = require("./errors");

module.exports.validateItemId = (req, res, next) => {
  const { itemId } = req.params;
  console.log(itemId);
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~]/;
  console.log(specialChars.test(itemId));
  if (specialChars.test(itemId) || itemId.length < 24 || itemId.length > 25) {
    res.status(VALIDATION_ERROR_CODE).send({ message: "Invalid ID" });
  } else {
    next();
  }
};

module.exports.validateUserId = (req, res, next) => {
  const { userId } = req.params;
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
  if (specialChars.test(userId) || userId.length < 24 || userId.length > 25) {
    res.status(VALIDATION_ERROR_CODE).send({ message: "Invalid ID" });
  } else {
    next();
  }
};
