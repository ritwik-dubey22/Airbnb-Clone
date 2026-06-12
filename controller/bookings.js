const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Express_Error = require("../utility/ExpressError.js");

const calculateNights = (checkIn, checkOut) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((checkOut - checkIn) / msPerDay);
};

module.exports.createBooking = async(req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body.booking || {};

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        throw new Express_Error(400, "Invalid booking dates.");
    }

    if (checkOutDate <= checkInDate) {
        req.flash("error", "Check-out date must be after check-in date.");
        return res.redirect(`/listings/${id}`);
    }

    const bookingNights = calculateNights(checkInDate, checkOutDate);
    if (bookingNights <= 0) {
        req.flash("error", "Booking must be at least one night.");
        return res.redirect(`/listings/${id}`);
    }

    const listing = await Listing.findById(id).populate("bookings");
    if (!listing) {
        throw new Express_Error(404, "Listing not found.");
    }

    const conflictingBooking = await Booking.findOne({
        listing: id,
        $or: [{
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
        }]
    });

    if (conflictingBooking) {
        req.flash("error", "Selected dates overlap with an existing booking.");
        return res.redirect(`/listings/${id}`);
    }

    const totalPrice = listing.price * bookingNights;

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: bookingNights,
        totalPrice
    });

    await booking.save();
    listing.bookings.push(booking);
    await listing.save();

    req.flash("success", "Booking confirmed! Your reservation has been saved.");
    res.redirect("/bookings");
};