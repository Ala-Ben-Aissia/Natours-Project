const express = require("express");
const userController = require("../controllers/userController");
const {
	protect,
	restrictTo,
} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.use(protect, restrictTo(["admin"]));

userRouter
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

userRouter
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = userRouter;
