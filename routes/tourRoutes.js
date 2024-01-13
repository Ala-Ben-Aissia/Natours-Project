const express = require("express");
const {
	getAllTours,
	getTour,
	AddTour,
	updateTour,
	deleteTour,
	getToursByYear,
	top5Tours,
	getToursStats,
} = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/stats").get(getToursStats);

toursRouter.route("/top-5").get(top5Tours, getAllTours);

toursRouter.route("/:year").get(getToursByYear);

toursRouter.route("/").get(getAllTours).post(AddTour);

toursRouter
	.route("/:tourId")
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

module.exports = {
	toursRouter,
};
