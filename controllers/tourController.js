const Tour = require("../models/tourModel");
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
	if (!tour) return next({ error: "Invalid ID" });
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
	if (!tour) return res.status(400).send({ error: "Invalid ID" });
	res.status(200).json({
		status: "success",
		data: tour,
	});
});

const deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.tourId);
	if (!tour) return res.status(400).send({ error: "Invalid ID" });
	res.status(204).json({
		status: "success",
		data: null,
	});
});

module.exports = {
	getAllTours,
	getTour,
	AddTour,
	updateTour,
	deleteTour,
};
