const express = require("express");
const Tour = require("./models/tourModel");
const { toursRouter } = require("./routes/tourRoutes");
const app = express();

app.use(express.json());

app.use("/tours", toursRouter);
module.exports = app;
