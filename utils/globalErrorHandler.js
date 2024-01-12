const globalErrorHandler = (err, req, res, next) => {
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

module.exports = globalErrorHandler;
