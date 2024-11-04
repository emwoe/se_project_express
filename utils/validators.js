const { VALIDATION_ERROR_CODE } = require("./errors");

module.exports.validateItemId = (req, res, next) => {
  const { id } = req.params;
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~]/;
  console.log(specialChars.test(id));
  if (specialChars.test(id) || id.length < 24 || id.length > 25) {
    res.status(VALIDATION_ERROR_CODE).send({ message: "Invalid ID" });
  } else {
    next();
  }
};
