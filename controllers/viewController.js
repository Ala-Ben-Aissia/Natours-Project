const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
   const tours = await Tour.find();
   res.status(200).render("overview", {
      title: "All tours",
      tours,
   });
});

exports.getTour = catchAsync(async (req, res, next) => {
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
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
   res.status(200).render("login");
});
