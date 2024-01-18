const AppError = require("./appError");

const handleErrorsDev = (err, res) => {
	return res.status(err.statusCode ?? 500).json({
		customError: {
			status: err.status ?? "error",
			message: err.message,
			name: err.name,
			error: err,
			isOperational: this.isOperational, // trusted and handled by developers
			// stack: err.stack,
		},
	});
};

const handleErrorsProd = (err, res) => {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		return res.status(500).json({
			status: "error",
			message: "OoOps.. Something went wrong!",
		});
	}
};

function handleValidationError(err) {
	const errors = Object.values(err.errors).map(
		(e) => e.properties.message
	);
	const message = `invalid input data: ${errors.join(". ")}`;
	return new AppError(message, 400);
}

const handleCastError = (err) =>
	new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateKeyError = (err) => {
	const [[field, value]] = Object.entries(err.keyValue);
	const msg = `duplicate key error collection: ${field} '${value}' already exists`;
	return new AppError(msg, 400);
};

const handleJWTError = () => new AppError("invalid jwt token", 401);

const globalErrorHandler = (err, req, res, next) => {
	if (process.env.NODE_ENV === "development") {
		handleErrorsDev(err, res);
	}
	if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (err.name === "CastError") error = handleCastError(err);
		if (err.code === 11000) error = handleDuplicateKeyError(err);
		if (err.name === "ValidationError")
			error = handleValidationError(err);
		if (err.name === "JsonWebTokenError")
			error = handleJWTError(err);
		handleErrorsProd(error, res);
	}
};

module.exports = globalErrorHandler;
