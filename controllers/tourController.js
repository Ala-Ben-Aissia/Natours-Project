const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const QueryAPI = require("../utils/queryAPI");

exports.getAllTours = catchAsync(async (req, res, next) => {
	const queryAPI = new QueryAPI(Tour.find(), req.query)
		.filter()
		.fields()
		.sort()
		.paginate();
	const tours = await queryAPI.query;
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId).exec();
	if (!tour) return next(new AppError("Tour Not Found!", 404));
	res.status(200).json({
		status: "success",
		data: tour,
	});
});

exports.AddTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: "success",
		data: newTour,
	});
});

exports.updateTour = catchAsync(async (req, res, next) => {
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

exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.tourId);
	if (!tour) return next(new AppError("Tour Not Found!", 404));
	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getToursByYear = catchAsync(async (req, res, next) => {
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
			$set: { month: "$_id" },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: {
				month: 1, // for consitent sorting (check $set stage)
			},
		},
	]);
	tours.forEach((tour) => {
		tour.month = new Date(
			null,
			tour.month,
			null
		).toLocaleDateString("en-US", {
			month: "long",
		});
	});
	res.status(200).json({
		status: "success",
		results: tours.length,
		tours,
	});
});

exports.getToursStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				avgRating: { $avg: "$ratingsAverage" },
				maxPrice: { $max: "$price" },
				minPrice: { $min: "$price" },
				avgPrice: { $avg: "$price" },
			},
		},
		{
			$project: {
				numTours: 1,
				maxPrice: 1,
				minPrice: 1,
				avgPrice: { $round: ["$avgPrice", 1] },
				avgRating: { $round: ["$avgRating", 1] },
			},
		},
		{
			$sort: { numTours: -1 },
		},
	]);
	res.status(200).json({
		status: "success",
		results: stats.length,
		stats,
	});
});

exports.top5Tours = (req, res, next) => {
	req.query.limit = 5;
	req.query.sort = "-ratingsAverage,price";
	req.query.fields = "name,ratingsAverage,price,duration";
	next();
};

exports.getToursWithIn = catchAsync(async (req, res) => {
	const { distance, center } = req.query;
	const radius = +distance / 6371; // Earth Radius: 6371 km
	const [lng, lat] = center.split(",").map((e) => +e);
	const tours = await Tour.find({
		startLocation: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius],
			},
		},
	});
	res.status(200).json({
		results: tours.length,
		data: {
			tours,
		},
	});
});
