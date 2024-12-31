const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); //a joi package that checks if the data that client sent has a valid schema or not
const Review = require("../models/review.js"); ////requiring the Review that are being exported by the  "review.js" file
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

const reviewController = require("../controllers/reviews.js")


//----------***************Reviews***********--------------------------
// -------------------(Post Review Route)------------------------------------
//this route will be together with '/listings' route as listings and reviews has one to many relationship
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//---------------------------(Delete Review Route)---------------------------------
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
