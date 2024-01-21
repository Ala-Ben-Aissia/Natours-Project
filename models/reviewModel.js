const mongoose = require("mongoose");
const Tour = require("./tourModel");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
	{
		reviewer: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: [true, "Review must belong to some user!"],
		},
		tour: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Tour",
			required: [true, "Review must belong to a tour!"],
		},
		review: {
			type: String,
		},
		rating: {
			type: Number,
			max: [5, "review must be at most 5!"],
			min: [1, "review must be at least 1!"],
			required: [true, "review must be rated!"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

//? Compound indexes (unique) ≈ Django's unique_together
// https://www.mongodb.com/docs/manual/core/index-unique/#unique-compound-index
reviewSchema.index({ tour: 1, reviewer: 1 }, { unique: true });

reviewSchema.statics.calcAvgRating = async function (tourId) {
	// this === Review
	const tourStats = await Review.aggregate([
		{
			$match: {
				tour: tourId,
			},
		},
		{
			$group: {
				_id: "$tour",
				numRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
		{
			$project: {
				avgRating: { $round: ["$avgRating", 1] },
				numRating: 1,
			},
		},
	]);
	const numRating = tourStats[0]?.numRating ?? 0; // 0 by default
	const avgRating = tourStats[0]?.avgRating; // delete from db if 0 reviews
	// if (!avgRating) or if (numRating === 0):
	if (!avgRating || numRating === 0) {
		const tour = await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: numRating,
		});
		tour.ratingsAverage = undefined;
		await tour.save();
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: numRating,
			ratingsAverage: avgRating,
		});
	}
};

//NOTE: review.model() === review.constructor

reviewSchema.post("save", async function (review, next) {
	await review.model().calcAvgRating(review.tour);
	next();
});

reviewSchema.post(/^findOneAnd/, async function (review, next) {
	if (!review) return next(new AppError("Review not found", 404));
	await review.model().calcAvgRating(review.tour);
	next();
});

reviewSchema.pre(/^find/, function (next) {
	this.select("-__v");
	this.populate({
		path: "reviewer",
		select: "username photo",
	});
	next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
