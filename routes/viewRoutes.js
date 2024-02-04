const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// router.post(
//    "/update-settings",
//    authController.protect,
//    viewController.updateSettings
// );

router.get("/me", authController.protect, viewController.getProfile);

router.use(authController.isLoggedIn);
// set user to be used in the .pug files (res.locals.user = user;)

router.get(
   "/",
   bookingController.createBookingCheckout,
   viewController.getOverview
);

router.get(
   "/my-bookings",
   authController.protect,
   viewController.myBookings
);

router.get("/tours/:slug", viewController.getTour);

router.get("/login", viewController.getLoginForm);

module.exports = router;
