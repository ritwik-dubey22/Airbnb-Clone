const mongoose = require("mongoose");

const review = require("./review.js");
const { string, required } = require("joi");
const Schema = mongoose.Schema; /// to define the schema in mongoDB

const listingSChema = new Schema({ // schema name == listingschema
    title: {
        type: String,

    },
    description: {
        type: String,

    },
    image: {


        url: String,
        filename: String


        // filename: String, /// change acrodibng to data in data .js

        // url: {
        //     type: String,
        //     default: "https://plus.unsplash.com/premium_photo-1661876449499-26de7959878f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

        //     // ## terny opertor ## it is like if else   matlb ki
        //     //  agar kuch value set hogi to ye link set ho jyegi
        //     // syntax = = = condition ? expression_if_true : expression_if_false;

        //     ,
        //     set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1661876449499-26de7959878f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        // }
    },
    price: Number,
    location: String,
    country: String,

    reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Review",
        } ///    id store hogi reviews kiiiii


    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }, // ✅ ADD THIS
    category: {
        type: String,
        enum: [
            "trending",
            "villa",
            "rooms",
            "cities",
            "mountain",
            "winter",
            "beach",
            "forest",
            "sunny"
        ]
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

listingSChema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const listing = mongoose.model("Listing", listingSChema); // listing name of table 
//basicallly ham table   (model) bna re with schema  


module.exports = listing; // exprt kr re h to app.js file