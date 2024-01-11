const express = require("express");
const { getAllTours } = require("../controllers/tourController");

const toursRouter = express.Router();

toursRouter.route("/").get(getAllTours);

module.exports = {
	toursRouter,
};
