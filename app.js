require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
/*
const bodyParser = require("body-parser");
*/
const mongoose = require("mongoose");
const { errors } = require("celebrate");

const clothingItemRouter = require("./routes/clothingItems");
const userRouter = require("./routes/users");
const mainRouter = require("./routes/index");
const errorHandler = require("./middleware/error-handler");
const NotFoundError = require("./errors/not-found-error");

const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());
/*
app.use(
  cors({
    origin: "https://whatshouldiwear.crabdance.com",
  })
);
*/

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

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
  next(new NotFoundError("Page not found."));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
