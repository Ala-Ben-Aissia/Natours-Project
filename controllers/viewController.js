const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = async (req, res, next) => {
   const tours = await Tour.find();
   res.status(200).render("overview", {
      title: "All tours",
      tours,
   });
};

exports.getTour = async (req, res, next) => {
   const { slug } = req.params;
   const tour = await Tour.findOne({ slug }).populate({
      path: "reviews",
      select: "-tour reviewer review rating",
   });
   if (!tour) return next(new AppError("Tour doesn't exist!", 404));
   res.status(200).render("tour", {
      title: tour.name,
      tour,
   });
};

exports.getLoginForm = async (req, res, next) => {
   res.status(200).render("login");
};

exports.getProfile = async (req, res, next) => {
   res.status(200).render("profile");
};

exports.updateSettings = catchAsync(async (req, res, next) => {
   const { user } = req;
   const { usernameX, emailX } = req.body;
   const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
         username: usernameX, // name attribute (html pug)
         email: emailX,
      },
      {
         runValidators: true,
         new: true,
      }
   );
   // passwords are handled separately
   // findByIdAndUpdate won't trigger the save middleware (to hash pwds when saved into the db)
   res.status(200).render("profile", {
      user: updatedUser,
   });
});
