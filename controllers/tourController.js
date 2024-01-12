const Tour = require("../models/tourModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getAllTours = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
});

const getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);
	if (!tour) return next(new AppError("Tour Not Found!", 404));
	res.status(200).json({
		status: "success",
		data: tour,
	});
});

const AddTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: "success",
		data: newTour,
	});
});

const updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(
		req.params.tourId,
		req.body,
		{
			runValidators: true,
			new: true,
		}
	);
	if (!tour) return next(new AppError("Tour Not Found!", 404));
	res.status(200).json({
		status: "success",
		data: tour,
	});
});

const deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.tourId);
	if (!tour) return next(new AppError("Tour Not Found!", 404));
	res.status(204).json({
		status: "success",
		data: null,
	});
});

const getToursByYear = catchAsync(async (req, res, next) => {
	// https://www.mongodb.com/docs/manual/reference/operator/aggregation/
	const year = +req.params.year;
	const tours = await Tour.aggregate([
		{
			$unwind: {
				path: "$startDates",
			},
		},
		{
			$match: {
				startDates: {
					$gte: new Date(String(year)),
					$lt: new Date(String(year + 1)),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				toursPerMonth: { $sum: 1 },
				tours: { $push: "$name" },
				// numRatings: { $sum: "$ratingsQuantity" },
				// x: { $push: "$ratingsQuantity" },
			},
		},
		{
			$sort: {
				_id: 1, // for consitent sorting
			},
		},
	]);
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
});

module.exports = {
	getAllTours,
	getTour,
	AddTour,
	updateTour,
	deleteTour,
	getToursByYear,
};
