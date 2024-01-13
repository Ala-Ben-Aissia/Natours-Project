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
	// make sure virtual properties are included when converting the document to an object or JSON.
	// this allows the virtual properties to be properly displayed in the outputs
);

//NOTE: Always follow the fat model thin controllers paradigm (MVC)

//* indexing
// tourSchema.index({ slug: 1 });

//* virtual properties
tourSchema.virtual("durationWeeks").get(function () {
	return durationConverter(this.duration);
});

//NOTE: Always make sure to implement middlewares before compiling the schema into model

//* document middlewares
// pre-save hook
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

//* query middlewares
tourSchema.pre(/^find/, async function (next) {
	this.start = Date.now();
	// this.find({ vip: false }); => throw error
	// by default vip is set to false in the schema BUT this does not create a vip field in the db
	// => it's a mongoose thing..
	// when creating a new tour with vip set to true, the vip fieldwill be saved in the db which makes ("vip": true) work.
	this.find({ vip: { $ne: true } });
	next();
});

tourSchema.post(/^find/, function (_, next) {
	console.log(
		`Query took ${Date.now() - this.start} ms to finsh execution`
	);
	next();
});

//* aggregation middlwares
// tourSchema.pre("aggregate", function (next) {
// 	console.log(this);
// 	next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
