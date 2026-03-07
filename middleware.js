// ## class error handling deflut error handling of express
const Express_Error = require("./utility/ExpressError.js")
    // ###   ../ for  diffrent folder


// ## joi package for validation of schema
// of the listings and review forms
const { listingSchema, reviewSchema } = require("./schema.js");


///1. # authentication before create new listings  
// /// login before create
const listing = require("./models/listing")
const reviews = require("./models/review.js")

/// middleware for authentication of the userr


module.exports.isLoggedin = (req, res, next) => { // to protect from req from postam server side validation 


    // this help isAuthenticated()     ====  me thod to check for a valid user 

    if (!req.isAuthenticated()) {
        // redirect to same page after login 
        req.session.redirecturl = req.originalUrl;

        req.flash("error", "You must be logged in to create a listing! 🔒")
        res.redirect("/login")

    }
    next();
}


// 2.because of the passport it delete the session information 
// so we have to store the url in the local storage 
module.exports.saveRedirecturl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
}


/// 3. autherization middleware
//  for checking the user is valid to do chnages



module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;

    // check for the athurisation 
    // user is that jisne ki listings ko banaya h
    const checklisting = await listing.findByIdAndUpdate(id);
    if (!checklisting.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied! Insufficient permissions 🔒")

        return res.redirect(`/listings/${id}`)
    }




    next();
}


// # 4.  server side validation for a form
///#1.listings
module.exports.validationlisting = (req, res, next) => {

    //creating server side validation with help of joi 
    let { error } = listingSchema.validate(req.body);

    if (error) {

        let errmsg = error.details.map((n) =>
            n.message).join(",");
        throw new Express_Error(400, errmsg)
    } else {
        next();
    }



}

// 5.// #2.reviews   validation SErVER Side
//review
module.exports.validationreview = (req, res, next) => {

    //creating server side validation with help of joi 
    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errmsg = error.details.map((n) =>
            n.message).join(",");
        throw new Express_Error(400, errmsg)
    } else {
        next();
    }



}


/// 6. autherization middleware
//  for checking the user is valid to do chnages iin the review


//---------------------⚠️  NOT using this valdidatopn from the ejs button not visible-----------------------------------------------



module.exports.isReview = async(req, res, next) => {
    let { id, reviewId } = req.params;

    // check for the athurisation 
    // user is that jisne ki listings ko banaya h
    const checklisting = await reviews.findById(reviewId);
    if (!reviews.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Access denied! Insufficient permissions 🔒")

        return res.redirect(`/listings/${id}`)
    }




    next();
}