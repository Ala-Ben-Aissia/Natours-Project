const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const {
	getAllDocs,
	getDoc,
	createDoc,
	updateDoc,
	deleteDoc,
} = require("../utils/docCRUD");

exports.getAllTours = getAllDocs(Tour);

exports.getTour = getDoc(Tour, { path: "reviews" });

exports.AddTour = createDoc(Tour);
exports.updateTour = updateDoc(Tour);
exports.deleteTour = deleteDoc(Tour);

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
	const { distance, center, unit } = req.query;
	const radius =
		unit === "mil" ? distance / 3963.19 : distance / 6378.19;
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

exports.getDistTours = catchAsync(async (req, res) => {
	const { coords, unit } = req.params;
	const [lat, lng] = coords.split(",").map((e) => +e);
	const multiplier = unit === "km" ? 1 / 1000 : 1 / 1609.34;
	// https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/#-geonear--aggregation-
	const tours = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [lng, lat],
				},
				distanceField: "distance",
				spherical: true,
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				name: 1,
				distance: 1,
			},
		},
		{
			$sort: {
				distance: 1,
			},
		},
	]);
	res.status(200).json({
		status: "success",
		data: {
			tours,
		},
	});
});
