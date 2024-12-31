const Review = require("../models/review.js"); ////requiring the Review that are being exported by the  "review.js" file
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

module.exports.createReview = async (req, res) => {
    //first finding the listing using the id
    let listing = await Listing.findById(req.params.id);

    //then extracting the review that came in the body of the request
    let newReview = new Review(req.body.review);

    //pushing the review into the DB of listings
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    //saving the new review
    await newReview.save();

    //updating the listings collections
    await listing.save();

    req.flash("success", "New Review Added");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};