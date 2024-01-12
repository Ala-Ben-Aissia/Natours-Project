const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { durationConverter } = require("../utils/durationConverter");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			unique: [true, "name already exists"],
			maxLength: [40, "name must be at most 40 characters"],
			minLength: [10, "name must be at least 10 characters"],
			match: [
				/^[a-zA-Z ]+$/,
				"name must only contain alphabetic characters",
			],
			// validate: {
			// 	validator: (val) => /^[a-zA-Z]+$/.test(val),
			// },
			// message: "name must only contain alphabetic characters",
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, "duration is required"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "maxGroupSize is required"],
		},
		difficulty: {
			type: String,
			required: [true, "difficulty is required"],
			enum: {
				values: ["easy", "medium", "difficult"],
				message:
					"Difficulty must be easy, medium or difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			max: [5, "ratingsAverage must be at most 5"],
			min: [1, "ratingsAverage must be at least 1"],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "price is required"],
		},
		summary: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, "description is required"],
		},
		imageCover: {
			type: String,
			required: [true, "imageCover is required"],
			match: [
				/\.(jpe?g)$/i,
				"Invalid image format. It should end with .jpeg or .jpg",
			],
			// i: case sensitive, e?: optional e, $: the end of the string, ^: the beginning of the string, \bpattern\b: exact match
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false, // hide from users
		},
		startDates: [Date],
		vip: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//virtuals
tourSchema.virtual("durationWeeks").get(function () {
	return durationConverter(this.duration);
});

tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name);
	next();
});

// tourSchema.pre(/^find/, function(next) {
// next();
// })

// tourSchema.pre("aggregate", function (next) {
// 	console.log(this);
// 	next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
