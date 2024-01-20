const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");

exports.getAllReviews = catchAsync(async (req, res, next) => {
	const tourId = req.params?.tourId ?? req.body?.tour;
	const tour = await Tour.findById(tourId);
	if (!tour) return next(new AppError("Tour not found", 400));
	const reviews = await Review.find({
		tour: tourId,
	});
	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

exports.createReview = catchAsync(async (req, res, next) => {
	const userId = req.user?.id ?? req.body?.reviewer;
	const tourId = req.params?.tourId ?? req.body?.tour;
	const reviewer = await User.findById(userId);
	const tour = await Tour.findById(tourId);
	if (!reviewer) return next(new AppError("User not found..", 403));
	if (!tour) return next(new AppError("Tour not found..", 403));
	const review = await Review.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			review,
		},
	});
});
