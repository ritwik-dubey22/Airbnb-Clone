const express = require("express");

// # MIDDLE WARE FOR AUNTHENTICATION
const { isLoggedin, isOwner, validationlisting, isReview } = require("../middleware.js")



const listing = require("../models/listing.js")
    // listing  ko to dusre folder se la rhe h  === schema(mongoDB) for the listiong


const router = express.Router({
    mergeParams: true

});

// ## using the Wrap Async function for error handling // instead of try and catch block...
const WrapAsync = require("../utility/WrapAsync.js")


// ## class error handling deflut error handling of express
const Express_Error = require("../utility/ExpressError.js")
    // ###   ../ for  diffrent folder

// ## joi package for validation of schema
// of the listings and review forms
const { listingSchema, reviewSchema } = require("../schema.js");

///# require review  schema h models(table) ka 
const review = require("../models/review.js")

const {
    validationreview
} = require("../middleware.js")



// require the controller for routes callbacks === MCV
const listingscontroller = require("../controller/review.js")



//#7 . review route  // POST reqest Route

router.post("/",
    isLoggedin, // to protect from req from postam server side validation 

    validationreview,
    WrapAsync(listingscontroller.create_Review));






//#8. review delete route 
router.delete("/:reviewId", isLoggedin, isReview, WrapAsync(listingscontroller.delete_route)) // id  matlb ki  ham listing  ki id ki baat kar h 
    // and like reviewId  jise kuch bhi new id ko specify krna pdega




module.exports = router