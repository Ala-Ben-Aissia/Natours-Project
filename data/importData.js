const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const Review = require("../models/reviewModel");

// const tours = JSON.parse(
// 	await fs.promises.readFile(
// 		path.join(__dirname, "..", "data", "toursSample.json"),
// 		"utf-8"
// 	)
// );

const importData = async (Model) => {
	const docs = JSON.parse(
		fs.readFileSync(
			path.join(__dirname, "..", "data", `${data}.json`),
			"utf-8"
		)
	);
	let loadedData = 0;
	const docsDB = await Model.find();
	const collection = Model.collection.name;
	for (const doc of docs) {
		if (docsDB.findIndex((e) => e.id === doc._id) === -1) {
			await Model.create(doc);
			loadedData++;
		}
	}
	if (loadedData > 0) {
		console.log(
			`${loadedData} ${
				loadedData > 1
					? `${collection}`
					: `${Model.modelName.toLowerCase()}`
			} have been imported`
		);
	} else {
		console.log(`${collection} have already been imported 📥`);
	}
	process.exit();
};
// this function is used to make sure thta: when production we won't retrieve tours data again and again with every server reload, instead it will always be loaded at the beginning

const [action, data] = process.argv[2]?.split("--") ?? [0, 0];
if (action === "import") {
	if (data === "tours") importData(Tour);
	if (data === "users") importData(User);
	if (data === "reviews") importData(Review);
}
module.exports = importData;
