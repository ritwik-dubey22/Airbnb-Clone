/// to define the schema in mongoDB
// FOR user

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const PLM = require("passport-local-mongoose"); // latest version may export as object

// const { schema } = require("./review");
// const { required } = require("joi");


// define the  schema for the   user  // login
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    } // the passport-local automatically
    //  define the password and user in the Schema
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);