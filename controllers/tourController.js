const Tour = require("../models/tourModel");

const getAllTours = async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
};

const getTour = async (req, res, next) => {
	try {
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
	} catch (error) {
		res.json({
			error: `${error.name}: ${error.message}`,
		});
	}
};

module.exports = {
	getAllTours,
	getTour,
};
