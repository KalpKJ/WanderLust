const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const ExpressError = require("../utils/ExpressErrors.js"); //to handle errors thrown by Express
const { reviewSchema } = require("../schema.js"); //a joi package that checks if the data that client sent has a valid schema or not
const Review = require("../models/review.js"); ////requiring the Review that are being exported by the  "review.js" file
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

//a function that uses joi to validate reviews on server side
const validateReview = (req, res, next) => {
  //extracting if there is any error from the request body using joi
  let { error } = reviewSchema.validate(req.body);

  //if there is error we will throw our ExpressError
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    //else we will call next middleware
    next();
  }
};

//----------***************Reviews***********--------------------------
// -------------------(Post Review Route)------------------------------------
//this route will be together with '/listings' route as listings and reviews has one to many relationship
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    //first finding the listing using the id
    let listing = await Listing.findById(req.params.id);

    //then extracting the review that came in the body of the request
    let newReview = new Review(req.body.review);

    //pushing the review into the DB of listings
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
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
