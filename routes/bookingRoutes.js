const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.use(authController.protect);

bookingRouter.post(
   "/checkout-session/:tourId",
   bookingController.createCheckoutSession
);

module.exports = bookingRouter;
