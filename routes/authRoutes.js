const express = require("express");
const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/sign-up", authController.signUp);

authRouter.post("/login", authController.login);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.post(
	"/reset-password/:token",
	authController.resetPassword
);

module.exports = authRouter;
