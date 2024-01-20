const mongoose = require("mongoose");

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

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
