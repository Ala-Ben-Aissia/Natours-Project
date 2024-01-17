const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const sendNewJWT = (res, user, code) => {
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	res.status(code).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

exports.signUp = catchAsync(async (req, res) => {
	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});
	sendNewJWT(res, user, 201);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password)
		return next(
			new AppError("email and password are required", 400)
		);
	const user = await User.findOne({ email });
	if (!user) return next(new AppError("Wrong credentials", 403));
	sendNewJWT(res, user, 200);
});
