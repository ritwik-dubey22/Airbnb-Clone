const express = require("express");

const listing = require("../models/listing.js")
    // listing  ko to dusre folder se la rhe h  === schema(mongoDB) for the listiong

const router = express.Router();
// require the controller for routes callbacks === MCV
const user_controller = require("../controller/user.js")

// requiire th user schema from models folder
const User = require("../models/user.js");
const WrapAsync = require("../utility/WrapAsync.js");

//  redirect the user on same page 
const { saveRedirecturl } = require("../middleware.js");


const passport = require("passport");



//1.using the the  router.routes  for signup

router.route("/signup")


// 1.to render the sign up form 
.get(user_controller.reneder_signup_form)



/// to update in the DB

// 2. signup route 
.post(WrapAsync(user_controller.signup)

)


//2.using the the  router.routes  for signup

router.route("/login")


// to render the login up form 
.get((user_controller.render_login_form))



// for authentication== 
.post(saveRedirecturl,
    passport.authenticate('local', {
        failureRedirect: '/login', // passport.authenticate ===  checks for the user is register or not 
        failureFlash: true
    }), user_controller.login)

router.get("/logout", user_controller.logout)
module.exports = router;

// to render the sign up form 
// router.get("/signup", user_controller.reneder_signup_form)



module.exports = router;









// /// to update in the DB

// // signup route 
// router.post("/signup", WrapAsync(user_controller.signup)

// )

// login route

// // to render the login up form 
// router.get("/login", (user_controller.render_login_form))






// // for authentication== 
// router.post("/login", saveRedirecturl,
//     passport.authenticate('local', {
//         failureRedirect: '/login', // passport.authenticate ===  checks for the user is register or not 
//         failureFlash: true
//     }), user_controller.login)

// router.get("/logout", user_controller.logout)