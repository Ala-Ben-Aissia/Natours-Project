const express = require("express");
const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.route("/sign-up").post(authController.signUp);

module.exports = authRouter;
