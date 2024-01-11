const Tour = require("../models/tourModel");

const getAllTours = async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
};

module.exports = {
	getAllTours,
};
