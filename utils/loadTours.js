const fs = require("fs");
const path = require("path");
const Tour = require("../models/tourModel");

const tours = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "..", "data", "toursSample.json"),
		"utf-8"
	)
);

// const tours = JSON.parse(
// 	await fs.promises.readFile(
// 		path.join(__dirname, "..", "data", "toursSample.json"),
// 		"utf-8"
// 	)
// );

const loadTours = async () => {
	let loadedData = 0;
	const toursDB = await Tour.find();
	for (const tour of tours) {
		if (toursDB.findIndex((e) => e.id === tour._id) === -1) {
			await Tour.create(tour);
			loadedData++;
		}
	}
	if (loadedData > 0) {
		console.log(`Loaded ${loadedData} tour(s)`);
		console.log("Data successfully loaded 📥");
	} else {
		console.log("Data has already been loaded 📥");
	}
};
// this function is used to make sure thta: when production we won't retrieve tours data again and again with every server reload, instead it will always be loaded at the beginning

module.exports = loadTours;
