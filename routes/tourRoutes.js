const express = require("express");
const {
	getAllTours,
	getTour,
	AddTour,
} = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/").get(getAllTours).post(AddTour);

toursRouter.route("/:tourId").get(getTour);

module.exports = {
	toursRouter,
};
