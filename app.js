const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");

if (process.env.DNS_SERVER) {
    dns.setServers([process.env.DNS_SERVER]);
} else {
    dns.setServers(['8.8.8.8']);
}
console.log("DNS servers set to:", dns.getServers());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


/// cloud setup
//to secure the credentionals
require("dotenv").config();
// if (process.env.NODE_ENV != "production") {
//     require("dotenv").config();
// }

console.log(process.env.SECRET);
const dburl = process.env.ATLASDB_URL


//----------------- mono connect  for session------------
// const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60 // itne time bd update ho session time period in seconds
})




//# Express-session  setup
const session = require("express-session");

// # setup of flash 
const flash = require("connect-flash");



// linking the listings route in the  route FOLder
const listings_Router = require("./routes/listing.js");



// linking the listings route in the  route FOLder
//# 1.  for || route ||
const reviews_Router = require("./routes/review.js");




//# setup for the   ejs
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

///# require review models(table)

//# 2.  for || schema || require of review
const review = require("./models/review.js")

// ## using the Wrap Async function for error handling // instead of try and catch block...
const WrapAsync = require("./utility/WrapAsync.js")

// ## class error handling deflut error handling of express
const Express_Error = require("./utility/ExpressError.js")


const listing = require("./models/listing.js")
    // listing  ko to dusre folder se la rhe h 





const user_Router = require("./routes/user.js")
    // user route from the route==== user.js file








// const mongo_url = "mongodb://127.0.0.1:27017/wandarlust";
const mongo_url = process.env.ATLASDB_URL;
console.log({ mongo_url })
    // ## joi package for validation of schema
    // of the listings and review forms
const { listingSchema, reviewSchema } = require("./schema.js");




// # passport setup 

const passport = require("passport");

const LocalStrategy = require("passport-local");
const User = require("./models/user.js")









main().then(() => {
        console.log("you are conncted to DB")
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(mongo_url);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled



}


// Make `req` globally available in all EJS templates
app.use((req, res, next) => {
    res.locals.req = req;
    next();
});



// app.get("/", (req, res) => {
//     res.send("it is working")
// })

// app.get("/testlisting", async(req, res) => {
//     let samplelisting = new listing({ // listing name table in mongoose data in inserted
//         title: "villa",
//         description: "on an beach",
//         image: "",
//         price: 1200,
//         location: "near indore"
//     })
// await samplelisting.save()

// console.log(samplelisting);
// console.log("the sample is saved on the DBs")
// res.send("sucesss");
// });


store.on("error", () => {

        console.log("ERROR is in MONGODB  SEssion STORE ", err);
    })
    ///# setup    express session
const sessionOptions = {
    store, // session info store on monogoatlas Db
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {
        expirers: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    } // for expriy date of cookie 
}


app.use(session(sessionOptions));
app.use(flash());



//# Authentication    ==    passport 
passport.use(new LocalStrategy(User.authenticate()));
///       using the method of local-password   
// authenticate() for user  signup and login


app.use(passport.initialize()); // for all req passwors initalize ho jyeee
app.use(passport.session());



passport.serializeUser(User.serializeUser()); // user ka login data ko insert krna inside the session 


passport.deserializeUser(User.deserializeUser()); // user ke data ko delete krna  from the session

// middleware with flash in locals storage
app.use((req, res, next) => {


    /// for the req.user to get the user info to login and logout
    res.locals.currUser = req.user;


    /// for the req.user to get the user info to login and logout
    res.locals.currUser = req.user;


    res.locals.success = req.flash("success");
    // jo bracket ke andar h wahi ### key h jo hamne udhar route mw use kiya h  
    res.locals.error = req.flash("error");


    next(); /// for flash the error  on top of page 





})

// app.get("/demouser", async(req, res) => {
//     let fakeuser = new User({
//         email: "ritwik@gmail.com",
//         username: "ritwik-dubey"
//     });


//     let register_new_user = await User.register(fakeuser, "2203205");
//     res.send(register_new_user)
// })

app.use(express.static(path.join(__dirname, "public")));





/// # 1.for  our  all listings routes     ||||  which is another file route ===  listings.js
app.use("/listings", listings_Router)


/// # 2.for  our  all review routes     ||||  which is another file route ===  review.js
app.use("/listings/:id/reviews", reviews_Router)



//#3. .for  our  all user routes     ||||  which is another file route ===  user.js

app.use("/", user_Router);






// esj-mate require it  
//  ## setup
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//





//error handling for a random route
// * is for all route
app.all("*", (req, res, next) => {
    next(new Express_Error(404, "Page NOT FOUND !"));

})



//# Error handling middleware 
// handling the input data of form // validation in form;;;


app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something Went Wrong.." } = err;
    res.status(statusCode).render("Error.ejs", { err })
        // res.status(statusCode).send(message);


})


























app.listen(3000, () => {
    console.log("server is listenig on the port")
})