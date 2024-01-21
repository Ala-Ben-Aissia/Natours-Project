const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");
const { getDoc, updateDoc, deleteDoc } = require("../utils/docCRUD");

exports.getAllReviews = catchAsync(async (req, res, next) => {
	const tourId = req.params?.tourId ?? req.body?.tour;
	const tour = await Tour.findById(tourId);
	const reviews = await Review.find({
		tour: tourId,
	}).select("-__v");
	if (!tour) return next(new AppError("Tour not found", 400));

	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

exports.getReview = getDoc(Review);

exports.createReview = catchAsync(async (req, res, next) => {
	const { user } = req;
	const tourId = req.params?.tourId ?? req.body?.tour;
	const tour = await Tour.findById(tourId);
	if (!user) return next(new AppError("Login to review..", 401));
	if (!tour) return next(new AppError("Tour not found..", 403));
	// const hasReviewed = await Review.findOne({
	// 	reviewer: user.id,
	// 	tour: tourId,
	// });
	// if (hasReviewed)
	// 	return next(new AppError("Cannot review more than once!"));
	const review = await Review.create({
		reviewer: user.id,
		tour: tourId,
		review: req.body.review,
		rating: req.body.rating,
	});
	review.__v = undefined;
	res.status(201).json({
		status: "success",
		data: {
			review,
		},
	});
});

exports.updateReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) return next(new AppError("Review not found", 404));
	const userId = req.user.id;
	const reviewerId = review.reviewer.id;
	if (userId !== reviewerId)
		return next(
			new AppError("You do not have permission ;)", 403)
		);
	const updatedReview = await Review.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ runValidators: true, new: true }
	);
	res.status(200).json({
		review: updatedReview,
	});
});
exports.deleteReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) return next(new AppError("Review not found", 404));
	const userId = req.user.id;
	const reviewerId = review.reviewer.id;
	if (userId !== reviewerId)
		return next(
			new AppError("You do not have permission ;)", 403)
		);
	await Review.findByIdAndDelete(req.params.id);
	res.status(204).json();
});
