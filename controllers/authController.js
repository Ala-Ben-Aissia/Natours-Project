const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const sendNewJWT = (res, user, code) => {
   const payload = { id: user.id };
   const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
   });
   const cookieOptions = {
      expires: new Date(
         Date.now() +
            process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // cookie cannot be manipulated from the browser
   };
   if (process.env.NODE_ENV === "production")
      cookieOptions.secure = true;
   res.cookie("jwt", token, cookieOptions);
   user.password = undefined; // remove password only from output (without saved)
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
   if (
      !req.headers.authorization?.startsWith("Bearer") &&
      !req.cookies.jwt
   ) {
      return next(new AppError("Login to grant access", 403));
   }
   const token =
      req.headers?.authorization?.split(" ") ?? req.cookies.jwt;
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

exports.restrictTo = (roles) => {
   return (req, res, next) => {
      if (roles.indexOf(req.user.role) === -1) {
         return next(new AppError("You don't have permission!"));
      }
      next();
   };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
   const { email } = req.body;
   if (!email) return next(new AppError("Email is required", 401));
   if (!validator.isEmail(email))
      return next(new AppError("Invalid Email", 400));
   const user = await User.findOne({ email });
   if (!user)
      return next(new AppError("Email not registered yet!", 401));
   const passwordResetToken = user.createPasswordResetToken();
   // this will generate a reset token + resetTokenExp to now (modified without saved)
   await user.save({ validateModifiedOnly: true });
   const resetUrl = `${req.protocol}://${req.get("host")}${
      req.baseUrl
   }/resetPassword/${passwordResetToken}`;
   const options = {
      email,
      subject: "Password reset token",
      text: `Natours password reset\nDear Natours user,\nWe’ve received your request to reset your password.\nPlease click the link below to complete the reset:\n${resetUrl}`,
   };
   try {
      await sendEmail(options);
      res.status(200).json({
         status: "success",
         message: "Password reset link has been sent to the user",
      });
   } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenEXP = undefined; // delete these from db
      await user.save({ validateModifiedOnly: true });
      return next(
         new AppError(
            `Failed to send the email.. ERROR: ${error}`,
            500
         )
      );
   }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
   const resetToken = req.params.token;
   // resetToken is in a hashed format in the db
   const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
   const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetTokenEXP: { $gt: Date.now() },
   });
   if (!user) return next(new AppError("Invalid or expired Token"));
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   user.passwordResetToken = undefined;
   user.passwordResetTokenEXP = undefined;
   await user.save();
   sendNewJWT(res, user, 200); // ≈ set jwt for user to log in with…
});

exports.updatePassword = catchAsync(async (req, res, next) => {
   const { user } = req;
   const { password, passwordConfirm, newPassword } = req.body;
   // if (!user.checkPwd(password, user.password))
   const currentUser = await User.findById(user.id).select(
      "+password"
   );

   const correctPasswords = await currentUser.checkPwd(
      password,
      currentUser.password
   );
   if (!correctPasswords)
      return next(
         new AppError("Please re-check your passwords!", 401)
      );
   currentUser.password = newPassword;
   await currentUser.save({ validateModifiedOnly: true });
   sendNewJWT(res, user, 200);
});

exports.getMe = (req, _, next) => {
   // setting userID before getUser
   req.params.id = req.user.id;
   next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
   const { user } = req;
   const allowedUpdates = {
      username: req.body.username,
      email: req.body.email,
      photo: req.body.photo,
   };
   const updatedUser = await User.findByIdAndUpdate(
      user,
      allowedUpdates,
      {
         runValidators: true,
         new: true,
      }
   );
   res.status(200).json({
      status: "success",
      updatedUser,
   });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
   const { user } = req;
   await User.findByIdAndUpdate(user.id, { active: false });
   res.status(204).json();
});

// only for rendered pages (no errors)
exports.isLoggedIn = catchAsync(async (req, res, next) => {
   if (!req.cookies.jwt) return next();
   // get token from cookies
   const token = req.cookies.jwt;
   // verify signature (checking if jwt has been changed by any malicious 3rd party..)
   const payload = await promisify(jwt.verify).call(
      null,
      token,
      process.env.JWT_SECRET
   );
   const user = await User.findById(payload.id);
   if (!user) return next();
   const pwdHasChanged = user.changedPwd(payload.iat);
   if (pwdHasChanged) {
      return next();
   }
   // logged in user verified
   // pass user to pug
   res.locals.user = user;
   next();
});

exports.logout = catchAsync(async (req, res, next) => {
   res.cookie("jwt", "", { maxAge: 10 * 1000, httpOnly: true });
   res.status(200).json({ status: "success" });
});
