const express = require("express");
const cors = require("cors");

const app = express();
/*
const bodyParser = require("body-parser");
*/
const mongoose = require("mongoose");
const clothingItemRouter = require("./routes/clothingItems");
const userRouter = require("./routes/users");
const mainRouter = require("./routes/index");
const { NOT_FOUND_CODE } = require("./utils/errors");

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);
app.use("/", clothingItemRouter);
app.use("/", userRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(console.error);

app.use((req, res, next) => {
  res.status(NOT_FOUND_CODE).send({ message: "Requested resource not found" });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
