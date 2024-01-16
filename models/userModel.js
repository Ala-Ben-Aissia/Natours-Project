const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		// minLength: [5, "Username must be at least 5 characters"],
		// maxLength: [15, "Username must be at most 15 characters"],
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
		// select: false,
	},
	photo: String,
	password: {
		type: String,
		minLength: [8, "Password must be at least 8 characters long"],
		required: [true, "Password is required"],
		// select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "PasswordConfirm is required"],
		validate: {
			validator: function (confirm) {
				return confirm === this.password;
			},
			message: "Passwords do not match",
		},
		// select: false,
	},
	active: {
		type: Boolean,
		default: true,
		// select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		// select: false,
	},
});

userSchema.pre(/^find/, function (next) {
	// this.start = Date.now();
	next();
});

userSchema.post(/^find/, function (doc, next) {
	// console.log(
	// 	`Users query took ${
	// 		Date.now() - this.start
	// 	} ms to finsh execution`
	// );
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
