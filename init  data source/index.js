const mongoose = require("mongoose");
const inserteddata = require("./data.js"); //data le re from the data.js file



const Listing = require("../models/listing.js");
// require kra listing wali file ko kyuki usme schema hhh



const mongo_url = "mongodb://127.0.0.1:27017/wandarlust";



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
const initDB = async() => {
    await Listing.deleteMany({});
    inserteddata.data = inserteddata.data.map((obj) => ({...obj, owner: "6984c02b9205ff100d97cf1d" }))
    await Listing.insertMany(inserteddata.data)
        // insertdata me data ko acces kr re he dusre file se  
    console.log("data is inserted", inserteddata);


};


initDB();