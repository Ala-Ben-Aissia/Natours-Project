const express = require("express");
const { toursRouter } = require("./routes/tourRoutes");
const globalErrorHandler = require("./utils/globalErrorHandler");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");

const app = express();

// Body Parser
app.use(express.json());

// Logger middleware
app.use(morgan("dev"));

// Tours middleware
app.use("/tours", toursRouter);
app.use("/users", userRouter);

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
