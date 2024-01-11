const express = require("express");
const Tour = require("./models/toursModel");
const app = express();

app.use(express.json());

app.get("/tours", async (req, res, next) => {
	const tours = await Tour.find();
	return res.status(200).json({
		status: "success",
		results: tours.length,
		data: tours,
	});
});
module.exports = app;
