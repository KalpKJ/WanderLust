const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");//a joi package that checks if the data that client sent has a valid schema or not
const ExpressError = require ("./utils/ExpressErrors.js"); //to handle errors thrown by Express

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectUrl
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) =>{
  let { id } = req.params;

  //first finding the id of the lisitng from the DB
  let listing = await Listing.findById(id);

  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
//a function that uses joi to validate listing on server side
module.exports.validateListing = (req, res, next) =>{

    //extracting if there is any error from the request body using joi
    let {error} = listingSchema.validate(req.body);

    //if there is error we will throw our ExpressError
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{//else we will call next middleware
        next();
    }
}


//a function that uses joi to validate reviews on server side
module.exports.validateReview = (req, res, next) => {
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

module.exports.isReviewAuthor = async (req, res, next) =>{
  let { id, reviewId } = req.params;

  //first finding the id of the review from the DB
  let review = await Review.findById(reviewId);

  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};