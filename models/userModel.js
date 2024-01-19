const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
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
		select: false,
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
		// select: false, => useless because this field won't persist in the db
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
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetTokenEXP: Date,
});

userSchema.pre("save", async function (next) {
	// only hash password when modified
	// this will prevent from hashing the pwd again and again (when updating any other field)
	if (!this.isModified("password")) return next();
	// hash password
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined; // useful only when registration
	next();
});
userSchema.pre("save", async function (next) {
	if (!this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now();
	next();
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: true });
	this.select("-__v");
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

userSchema.methods.checkPwd = async function (rawPwd, hashedPwd) {
	return await bcrypt.compare(rawPwd, hashedPwd);
};

userSchema.methods.changedPwd = function (tokenTimestamp) {
	if (!this.passwordChangedAt) return false;
	return tokenTimestamp < this.passwordChangedAt.getTime() / 1000;
};

userSchema.methods.createPasswordResetToken = function () {
	const token = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto
		.createHash("sha256")
		.update(token)
		.digest("hex");
	this.passwordResetToken = hashedToken;
	this.passwordResetTokenEXP =
		Date.now() + process.env.RESET_TOKEN_EXPIRES_IN * 1;
	// console.log(token, hashedToken);
	return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
