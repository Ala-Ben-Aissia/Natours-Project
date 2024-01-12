const express = require("express");
const {
	getAllTours,
	getTour,
	AddTour,
	updateTour,
	deleteTour,
	getToursByYear,
} = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/").get(getAllTours).post(AddTour);

toursRouter
	.route("/:tourId")
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

toursRouter.route("/year/:year").get(getToursByYear);

module.exports = {
	toursRouter,
};
