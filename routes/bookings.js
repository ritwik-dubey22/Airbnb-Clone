const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedin, validationBooking } = require("../middleware.js");
const WrapAsync = require("../utility/WrapAsync.js");
const bookingsController = require("../controller/bookings.js");

router.post("/", isLoggedin, validationBooking, WrapAsync(bookingsController.createBooking));

module.exports = router;