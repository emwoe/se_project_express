const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const clothingItemRouter = require("./routes/clothingItems");
const userRouter = require("./routes/users");

const { PORT = 3001 } = process.env;

app.use(express.json());

function checkAddress(req, res, next) {
  if (res.statusCode === 404) {
    res.send("The requested item could not be found");
  }
  next();
}

app.use("/", clothingItemRouter);
app.use("/", userRouter);

/*
app.use("/", function (res, req, next) {
  if (res.statusCode === 404) {
    res.send({ message: "The requested item could not be found" });
  }
});
*/

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  req.user = {
    _id: "66fd75e6eb5d673668892101",
  };
  next();
});

app.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
