const { default: mongoose } = require("mongoose");
require("dotenv").config();

mongoose.connection.once("open", () => {
	console.log("MongoDB Connection Succeeded ✅");
});

mongoose.connection.on("error", (err) => {
	console.error(`MongoDB Connection Failed ❌: `, err);
});

const mongoConnect = async () => {
	await mongoose.connect(process.env.mongoDB_url);
};

module.exports = mongoConnect;
