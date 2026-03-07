///schema validation  with help of joi npm package
//for server side validation
// #1. for new listing form 
const joi = require('joi');
const review = require('./models/review');
module.exports.listingSchema = joi.object({

    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.string().required(),

        /// for img object alg se validation daal na pdega ni to error
        image: joi.object({
            filename: joi.string().allow("", null),
            url: joi.string().allow("", null)
        }).required()

    }).required()




});

//#2. joi schema  for the review

module.exports.reviewSchema = joi.object({

    review: joi.object({
        rating: joi.number().required().
        min(1).
        max(5),
        Comment: joi.string().required(),

    }).required()




});