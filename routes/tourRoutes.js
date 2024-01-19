const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const toursRouter = express.Router();

toursRouter
	.route("/distances/coords/:coords/unit/:unit")
	.get(tourController.getDistTours);

toursRouter.route("/range").get(tourController.getToursWithIn);

toursRouter
	.route("/top-5")
	.get(tourController.top5Tours, tourController.getAllTours);

toursRouter.route("/stats").get(tourController.getToursStats);

toursRouter
	.route("/monthly-plan/:year")
	.get(
		authController.protect,
		authController.restrictTo(["admin", "leader", "guide"]),
		tourController.getToursByYear
	);

toursRouter
	.route("/")
	.get(tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo(["admin", "leader"]),
		tourController.AddTour
	);

toursRouter
	.route("/:id")
	.get(tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo(["admin", "leader"]),
		tourController.updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo(["admin", "leader"]),
		tourController.deleteTour
	);

module.exports = {
	toursRouter,
};
