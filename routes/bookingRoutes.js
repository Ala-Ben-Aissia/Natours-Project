const express = require("express");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.use(authController.protect);

bookingRouter.post(
   "/checkout-session/:tourId",
   bookingController.createCheckoutSession
);

bookingRouter.use(authController.restrictTo(["admin", "leader"]));

bookingRouter
   .route("/")
   .get(bookingController.getAllBookings)
   .post(bookingController.AddBooking);

bookingRouter
   .route("/:id")
   .get(bookingController.getBooking)
   .patch(
      bookingController.updateBooking,
      bookingController.deleteBooking
   );

module.exports = bookingRouter;
