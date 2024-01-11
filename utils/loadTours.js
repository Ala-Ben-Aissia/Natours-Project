const fs = require("fs");
const path = require("path");
const Tour = require("../models/toursModel");

const tours = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "..", "data", "toursSample.json"),
		"utf-8"
	)
);

const loadTours = async () => {
	const toursDB = await Tour.find();
	for (const tour of tours) {
		if (!toursDB.find((e) => (e._id = tour._id))) {
			await Tour.create(tour);
		}
	}
	console.log("Data successfully loaded 📥");
};

module.exports = loadTours;
