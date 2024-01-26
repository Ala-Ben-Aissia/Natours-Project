const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
   "/update-settings",
   authController.protect,
   viewController.updateSettings
);

router.get("/me", authController.protect, viewController.getProfile);

router.use(authController.isLoggedIn);
// set user to be used in the .pug files (res.locals.user = user;)

router.get("/", viewController.getOverview);

router.get("/tours/:slug", viewController.getTour);

router.get("/login", viewController.getLoginForm);

module.exports = router;
