const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		minLength: [5, "Username must be at least 5 characters"],
		maxLength: [15, "Username must be at most 15 characters"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: [true, "Email already exists"],
		lowerCase: true,
		validate: [validator.isEmail, "Invalid email"], // https://www.npmjs.com/package/validator
	},
	role: {
		type: String,
		enum: {
			values: ["user", "guide", "leader", "admin"],
			message: "Role must be admin, guide, leader or user",
		},
		default: "user",
	},
	photo: String,
	password: {
		type: String,
		minLength: [8, "Password must be at least 8 characters long"],
		required: [true, "Password is required"],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "PasswordConfirm is required"],
		validate: {
			validator: function (val) {
				return val === this.password;
			},
			message: "Passwords do not match",
		},
		select: false,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
