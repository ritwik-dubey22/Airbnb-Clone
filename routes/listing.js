const express = require("express");
const router = express.Router();



const listing = require("../models/listing.js")
    // listing  ko to dusre folder se la rhe h  === schema(mongoDB) for the listiong

// # MIDDLE WARE FOR AUNTHENTICATION
const { isLoggedin, isOwner, validationlisting } = require("../middleware.js")


// ## using the Wrap Async function for error handling // instead of try and catch block...
const WrapAsync = require("../utility/WrapAsync.js")


// ## class error handling deflut error handling of express
const Express_Error = require("../utility/ExpressError.js")
    // ###   ../ for  diffrent folder


// ## joi package for validation of schema
// of the listings and review forms
const { listingSchema, reviewSchema } = require("../schema.js");

/// # adding our route's logic FROM CONTROLLER 
const listingscontroller = require("../controller/listings.js")


//----------------------------------------------------------------------------------------
//cloud setup
// multer for upload images from form
const multer = require('multer') //  === form ki file ko read krne me help

const { storage } = require("../cloudconfig.js") // from config file 
const upload = multer({ storage })

//----------------------------------------------------------------------------------------------------

// router.post("/", isLoggedin, WrapAsync(listingscontroller.create_new_listings))
const methodOverride = require("method-override") // for form post (method)== put/delete
router.use(methodOverride("_method"));



/// $$ listings wle all ROUte ARE here 

// implent the
//  router .route for same paths("/")

router.route("/")

// //#1. index route..
.get(WrapAsync(listingscontroller.index))

// //#3. Create === show wle route se form se data aa ra ab usko database me update krna pdega

.post(isLoggedin, upload.single('listing[image]'), WrapAsync(listingscontroller.create_new_listings))
    /// image url uploaded from here   this middlewarte of 



//-----------------------------------------------------------------------------------
//#3. 2. NEW ROUTE === show route  isko pehle hi  likhna pdega ni to js isko ## (/new )ko id samj le ga
router.get("/new", isLoggedin, listingscontroller.rendernewform);




/// # 4 . edit route
router.get("/:id/edit", isLoggedin, isOwner,
    // validationlisting,
    WrapAsync(listingscontroller.edit_listings));



//----------------------------------------------------------------------------------




router.route("/:id")
    //#2.   show route
    .get(WrapAsync(listingscontroller.showing_all_listings)

    )





///#5 .edit route ===  update route    froms    req convereted into the put req
.put(isLoggedin,
    isOwner,
    upload.single('listing[image]'),
    WrapAsync(listingscontroller.update_listings_form))


//#6  DELETE ROUTE 
.delete(isLoggedin, isOwner, WrapAsync(listingscontroller.delete))





// //#1. index route..

// router.get("/", WrapAsync(listingscontroller.index));


// for url niklne ke liye

// middleware
router.use(express.urlencoded({ extended: true }))

// //#2.  1. show route
// router.get("/:id", WrapAsync(listingscontroller.showing_all_listings)

// )




// //#3.  3.  Create show wle route se form se data aa ra ab usko database me update krna pdega






// ///#5 . update route    froms    req convereted into the put req
// router.put("/:id", isLoggedin, isOwner,

//     validationlisting, WrapAsync(listingscontroller.update_listings_form))



// //#6  DELETE ROUTE 
// router.delete("/:id", isLoggedin, isOwner, WrapAsync(listingscontroller.delete))




// router wle obj ko app.js se connect link krna pdega naaa
module.exports = router