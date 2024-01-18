const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const sendNewJWT = (res, user, code) => {
	const payload = { id: user.id };
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
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
	const user = await User.findOne({ email }).select("+password");
	const correctPwd = await user?.checkPwd(password, user.password);
	if (!user || !correctPwd)
		return next(new AppError("Wrong credentials", 401));
	sendNewJWT(res, user, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
	// jwt verification
	if (!req.headers.authorization?.startsWith("Bearer")) {
		return next(new AppError("Login to grant access", 403));
	}
	const [type, token] = req.headers.authorization.split(" ");
	// verify signature (checking if jwt has been changed by any malicious 3rd party..)
	const payload = await promisify(jwt.verify).call(
		null,
		token,
		process.env.JWT_SECRET
	);
	/**
	 * what if:
	 * 1. user has changed his password => update jwt
	 * 2. user has logged out => destroy jwt
	 * 3. user has been deleted (deactivated) => destroy jwt
	 */
	const user = await User.findById(payload.id);
	if (!user)
		return next(new AppError("OoOps! User doesn't exists", 401));
	const pwdHasChanged = user.changedPwd(payload.iat);
	if (pwdHasChanged) {
		return next(new AppError("User must login again!", 401));
	}
	req.user = user;
	next();
});

exports.getMe = (req, _, next) => {
	// setting userID before getUser
	req.params.id = req.user.id;
	next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
	const { user } = req;
});
