const express = require("express");

const reviewRouter = express.Router({ mergeParams: true });

const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

reviewRouter
	.route("/")
	.get(reviewController.getAllReviews)
	.post(authController.protect, reviewController.createReview);

reviewRouter
	.route("/:id")
	.get(reviewController.getReview)
	.patch(authController.protect, reviewController.updateReview)
	.delete(authController.protect, reviewController.deleteReview);

module.exports = reviewRouter;
