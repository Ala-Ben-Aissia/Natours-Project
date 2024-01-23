const express = require("express");
const { toursRouter } = require("./routes/tourRoutes");
const globalErrorHandler = require("./utils/globalErrorHandler");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");

const app = express();

// Body Parser
app.use(express.json());

// Logger middleware
app.use(morgan("dev"));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
// handle unknown routes
app.use("*", (req, res, next) => {
	return next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
