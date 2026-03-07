// routws of review


const listing = require("../models/listing.js")


///# require review  schema h models(table) ka 
const review = require("../models/review.js")


//#1  . review route  // POST reqest Route

module.exports.create_Review = async(req, res) => {

    console.log(req.params.id);
    let Listing = await listing.findById(req.params.id); // wahi waali listing jiskki ye id h 
    // req.body.review.rating = Number(req.body.review.rating);

    let newReview = new review(req.body.review); // review wali table m req.body se aya review store kr re h
    // store the data coming from the froms name =review[commment],[rating]

    //--------------------------------------------------------------------------
    // &&& # new SECTION AUTHOR OF The review

    newReview.author = req.user._id /// ye user apne database wla nhi hh   user basically
        //  req ke andar ki key hh  
    console.log(newReview)
    Listing.reviews.push(newReview);
    // -----------------------------------------------------------------------


    await newReview.save();
    await Listing.save();

    console.log("new review is saved  as  successfully");

    //Using the flash here  to pop message 
    req.flash("success", "New Review created Successfully!")


    res.redirect(`/listings/${Listing._id}`);


}




//#2.  review delete route

module.exports.delete_route = async(req, res) => {

    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });



    await review.findByIdAndDelete(reviewId);

    //Using the flash here  to pop message 
    req.flash("success", " Review Deleted Successfully!")

    res.redirect(`/listings/${id}`)

}