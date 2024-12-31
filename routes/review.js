const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); //a joi package that checks if the data that client sent has a valid schema or not
const Review = require("../models/review.js"); ////requiring the Review that are being exported by the  "review.js" file
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file



//----------***************Reviews***********--------------------------
// -------------------(Post Review Route)------------------------------------
//this route will be together with '/listings' route as listings and reviews has one to many relationship
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
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
  })
);

//---------------------------(Delete Review Route)---------------------------------
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
