const express = require("express");
const { toursRouter } = require("./routes/tourRoutes");
const globalErrorHandler = require("./utils/globalErrorHandler");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");
const { default: rateLimit } = require("express-rate-limit");
const { default: helmet } = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const app = express();

// Body Parser
app.use(express.json());

// helmet (setting HTTP response headers)
app.use(helmet());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// prevent params pollution
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"difficulty",
			"price",
		],
		// fileds that are allowed to be used multiple times in querying(params)
	})
);

// limit requests rate(throttling)
const limiter = rateLimit({
	limit: 100, // default to 5
	windowMs: 60 * 60 * 1000, // 100 requests per hour
	message: `Too many requests, please try again after 1 hour !`,
});
app.use("/api", limiter);

// Logger middleware
app.use(morgan("dev"));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
// handle unknown routes`
app.use("*", (req, res, next) => {
	return next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

// Global Error Handling
app.use(globalErrorHandler);

module.exports = app;
