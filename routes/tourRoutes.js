const express = require("express");
const {
	getAllTours,
	getTour,
} = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/").get(getAllTours);

toursRouter.route("/:tourId").get(getTour);

module.exports = {
	toursRouter,
};
