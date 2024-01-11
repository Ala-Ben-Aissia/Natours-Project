const globalErrorHandler = (err, req, res, next) => {
	return res.status(400).json({
		customError: {
			name: err.name,
			message: err.message,
			stack: err.stack,
		},
	});
};

module.exports = globalErrorHandler;
