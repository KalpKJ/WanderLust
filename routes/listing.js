const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const {listingSchema} = require("../schema.js");//a joi package that checks if the data that client sent has a valid schema or not
const ExpressError = require ("../utils/ExpressErrors.js"); //to handle errors thrown by Express
const {isLoggedIn} = require("../middleware.js"); // added the middleware file


//a function that uses joi to validate listing on server side
const validateListing = (req, res, next) =>{

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

//-------------------Index Route------------------------
//this will show us all the listings that are added by default
router.get(
  "/",
  wrapAsync(async (req, res) => {
    //this is finding all the listings stored in 'Listing' model of DB
    const allListings = await Listing.find({});

    //we are rendering the html page through 'index.ejs' and passing in the all the listings to use in that file
    res.render("./listings/index.ejs", { allListings });
  })
);

//--------------------------New Route----------------------------
//this route will take you to a page where you can add your own listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});
//------------------------Create Route-----------------------------
//this will actually add a new listing using a POST request after validating it
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
  })
);
//--------------------------Show Route----------------------------
//this will show a particular listing that has been clicked upon - READ
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      //storing the id in a variable that is coming as parameters in request
      let { id } = req.params;
  
      //finding the particular listing stored in out DB using the id
      const listing = await Listing.findById(id).populate("reviews").populate("owner");
  
      if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
      }

      //rendering the 'show.ejs' file whenever a link is clicked upon and passing the details of listing to the file
      res.render("./listings/show.ejs", { listing });
    })
  );
//--------------------------Edit Route-----------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    //storing the id in a variable that is coming as parameters in request
    let { id } = req.params;
    
    //finding the particular listing stored in out DB using the id
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);
//--------------------------Update Route----------------------------------
//this route will help redirect from the edit route and it will put the newly updated listing on the homepage after validating the request
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    //this will find the id and update the new changes by deconstructing the old ones
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated");

    //redirecting to the same listing
    res.redirect(`/listings/${id}`);
  })
);

//-------------------------Delete Route--------------------------------------------
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
