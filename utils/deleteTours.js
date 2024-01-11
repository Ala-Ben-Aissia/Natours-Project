const Tour = require("../models/toursModel");

const deleteTours = async () => {
	await Tour.deleteMany();
	console.log("Data successfully deleted 🚮");
	process.exit();
};

module.exports = deleteTours;
