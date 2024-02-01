const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.use(authController.protect);

bookingRouter.get(
   "/checkout-session/:tourId",
   bookingController.getCheckoutSession
);

module.exports = bookingRouter;
