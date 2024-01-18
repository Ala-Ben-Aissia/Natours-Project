const express = require("express");
const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/sign-up", authController.signUp);

authRouter.post("/login", authController.login);

authRouter.get("/protect", authController.protect);

module.exports = authRouter;
