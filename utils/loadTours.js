const fs = require("fs");
const path = require("path");
const Tour = require("../models/tourModel");

const tours = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "..", "data", "toursSample.json"),
		"utf-8"
	)
);

const loadTours = async () => {
	let loadedData = 0;
	const toursDB = await Tour.find();
	for (const tour of tours) {
		if (!toursDB.find((e) => (e._id = tour._id))) {
			await Tour.create(tour);
			loadedData++;
		}
	}
	if (loadedData > 0) {
		console.log("Data successfully loaded 📥");
	} else {
		console.log("Data has already been loaded 📥");
	}
};

module.exports = loadTours;
