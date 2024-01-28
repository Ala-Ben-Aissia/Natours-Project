const AppError = require("./appError");

const handleErrorsDev = (err, req, res) => {
   return req.originalUrl.startsWith("/api")
      ? // API
        res.status(err.statusCode ?? 500).json({
           status: err.status ?? "error",
           message: err.message,
           name: err.name,
           error: err,
           isOperational: this.isOperational, // trusted and handled by developers
           stack: err.stack,
        })
      : // Rendered Error (WEBSITE)
        res.status(err.statusCode ?? 500).render("error", {
           title: "An Error Has Occured!",
           msg: err.message,
        });
};

const handleErrorsProd = (err, req, res) => {
   // API
   if (req.originalUrl.startsWith("/api")) {
      if (err.isOperational) {
         // operational => trusted (expected + handled)
         return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
      }
      // generic error (leak minimum error details to users)
      return res.status(500).json({
         status: "error",
         message: "Something went very wrong!",
      });
   }
   // BROWSER
   if (err.isOperational) {
      // operational => trusted (expected + handled)
      return res.status(err.statusCode).render("error", {
         title: "OoOps.. Something went wrong!",
         msg: err.message,
      });
   }
   // generic error (leak minimum error details to users)
   return res.status(500).render("error", {
      title: "Something went wrong!!!",
      msg: "Please try later..",
   });
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
function handleDuplicateKeyError(err) {
   const [[field, value]] = Object.entries(err.keyValue);
   const msg = `duplicate key error collection: ${field} '${value}' already exists`;
   return new AppError(msg, 400);
}

const handleJWTError = () => new AppError("invalid jwt token", 401);

const globalErrorHandler = (err, req, res, next) => {
   if (process.env.NODE_ENV === "development") {
      handleErrorsDev(err, req, res);
   }
   if (process.env.NODE_ENV === "production") {
      let error = { ...err, message: err.message };
      if (err.name === "CastError") error = handleCastError(err);
      if (err.code === 11000) error = handleDuplicateKeyError(err);
      if (err.name === "ValidationError")
         error = handleValidationError(err);
      if (err.name === "JsonWebTokenError")
         error = handleJWTError(err);
      handleErrorsProd(error, req, res);
   }
};

module.exports = globalErrorHandler;
