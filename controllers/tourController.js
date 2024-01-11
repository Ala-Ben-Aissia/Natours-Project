const Tour = require("../models/tourModel");
const catchAsyncCallback = require("../utils/catchAsync");

const getAllTours = catchAsyncCallback(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
});

const getTour = catchAsyncCallback(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);
	if (!tour)
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	res.status(200).json({
		status: "success",
		data: tour,
	});
});

module.exports = {
	getAllTours,
	getTour,
};
