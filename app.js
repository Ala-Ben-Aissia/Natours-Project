const express = require("express");
const { toursRouter } = require("./routes/tourRoutes");
const globalErrorHandler = require("./utils/globalErrorHandler");
const app = express();

app.use(express.json());

app.use("/tours", toursRouter);
app.use(globalErrorHandler);
module.exports = app;
