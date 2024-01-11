const express = require("express");
const {
	getAllTours,
	getTour,
	AddTour,
	updateTour,
	deleteTour,
} = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/").get(getAllTours).post(AddTour);

toursRouter
	.route("/:tourId")
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

module.exports = {
	toursRouter,
};
