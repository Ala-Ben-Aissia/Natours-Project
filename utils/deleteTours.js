const Tour = require("../models/tourModel");

const deleteTours = async () => {
	if (process.argv[2] === "--delete") {
		await Tour.deleteMany();
		console.log("Data successfully deleted 🚮");
		process.exit();
	}
};

module.exports = deleteTours();
