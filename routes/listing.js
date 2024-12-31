const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); // added the middleware file

const listingController = require("../controllers/listings.js")

//-------------------Index Route------------------------
//this will show us all the listings that are added by default
router.get("/", wrapAsync(listingController.index));

//--------------------------New Route----------------------------
//this route will take you to a page where you can add your own listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
//------------------------Create Route-----------------------------
//this will actually add a new listing using a POST request after validating it
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);
//--------------------------Show Route----------------------------
//this will show a particular listing that has been clicked upon - READ
router.get("/:id", wrapAsync(listingController.showListing));
//--------------------------Edit Route-----------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
//--------------------------Update Route----------------------------------
//this route will help redirect from the edit route and it will put the newly updated listing on the homepage after validating the request
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//-------------------------Delete Route--------------------------------------------
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
