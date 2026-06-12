// user model schema 
const User = require("../models/user.js")
const Booking = require("../models/booking.js")
const Listing = require("../models/listing.js")







//signup   of user
// 1.1
module.exports.reneder_signup_form = (req, res) => {
    res.render("users/signup.ejs")
}



//# .1 .2
module.exports.signup = async(req, res) => {

    try {

        let { email, username, password } = req.body;

        console.log(req.body);
        const newUser = new User({ email, username });
        const registered_user = await User.register(newUser, password);
        console.log(registered_user);

        // # jab user sginup kre to 
        // automtaic login hooo jye with help oof ==== login()

        req.login(registered_user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust  🎉 Your account has been created successfully!")
            res.redirect("/listings")
        })


    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }
}

module.exports.bookingHistory = async(req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
    res.render("bookings/index.ejs", { bookings });
};

module.exports.cancelBooking = async(req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Express_Error(404, "Booking not found.");
    }
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You are not authorized to cancel this booking.");
        return res.redirect("/bookings");
    }
    await Listing.findByIdAndUpdate(booking.listing, { $pull: { bookings: booking._id } });
    await Booking.findByIdAndDelete(bookingId);
    req.flash("success", "Booking canceled successfully.");
    res.redirect("/bookings");
};

module.exports.hostDashboard = async(req, res) => {
    // Get all listings owned by the current user
    const hostListings = await Listing.find({ owner: req.user._id });
    const listingIds = hostListings.map((listing) => listing._id);

    // Get all bookings for the host's listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing")
        .populate("user", "username email")
        .sort({ checkIn: -1 });

    res.render("host/dashboard.ejs", { bookings, listingCount: hostListings.length });
};


//login form
// 1.1

module.exports.render_login_form = (req, res) => {
    res.render("users/login.ejs")
}

///1.2   login    == confirm the login 

module.exports.login = async(req, res) => {
    req.flash("success", "welcome back to wanderlust")
    res.redirect(res.locals.redirecturl || "/listings")

}



/// 1.1   logout route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings")
    })
}