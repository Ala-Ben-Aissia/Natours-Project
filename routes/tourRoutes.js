const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const toursRouter = express.Router();

toursRouter
	.route("/distances/coords/:coords/unit/:unit")
	.get(tourController.getDistTours);

toursRouter.route("/range").get(tourController.getToursWithIn);

toursRouter.route("/stats").get(tourController.getToursStats);

toursRouter
	.route("/top-5")
	.get(tourController.top5Tours, tourController.getAllTours);

toursRouter.route("/:year").get(tourController.getToursByYear);

toursRouter.use(authController.protect);

toursRouter
	.route("/")
	.get(tourController.getAllTours)
	.post(tourController.AddTour);

toursRouter
	.route("/:tourId")
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = {
	toursRouter,
};
