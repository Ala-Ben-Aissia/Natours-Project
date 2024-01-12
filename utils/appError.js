class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4")
			? "fail"
			: "error";
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor); // Without this line of code, the error stack would include the internal Error.captureStackTrace function call. However, with this implementation, the error stack starts from the point where the AppError instance is created, providing a more accurate representation of the function calls that led to the error
	}
}

module.exports = AppError;
