const mongoose = require("mongoose");
const Schema = mongoose.Schema; /// to define the schema in mongoDB

/// schema for the rating model 
const review_schema = new Schema({
    Comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // jisne review likha us user ka naam
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", /// user ki id jisne review likha h  
    }

});

module.exports = mongoose.model("Review", review_schema);