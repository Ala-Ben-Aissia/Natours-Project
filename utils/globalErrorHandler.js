const globalErrorHandler = (err, req, res, next) => {
	return res.json({
		customError: {
			name: err.name,
			message: err.message,
			stack: err.stack,
		},
	});
};

module.exports = globalErrorHandler;
