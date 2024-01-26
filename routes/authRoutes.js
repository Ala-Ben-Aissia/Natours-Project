const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const authRouter = express.Router();

authRouter.post("/sign-up", authController.signUp);

authRouter.post("/login", authController.login);

authRouter.get("/logout", authController.logout);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.patch(
   "/reset-password/:token",
   authController.resetPassword
);

authRouter.patch(
   "/update-password",
   authController.protect,
   authController.updatePassword
);

authRouter.use(authController.protect);

authRouter.get("/me", authController.getMe, userController.getUser);

authRouter.patch(
   "/update-me",
   authController.getMe,
   authController.updateMe
);

authRouter.delete(
   "/delete-me",
   authController.getMe,
   authController.deleteMe
);

module.exports = authRouter;
