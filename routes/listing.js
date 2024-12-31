const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file
const wrapAsync = require("../utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); // added the middleware file
const multer = require("multer") //to read the data of image that is coming in form of files instead of url
const upload = multer({dest: "uploads/"}); //storing the data here in this folder

const listingController = require("../controllers/listings.js")


router.route("/")

  //-------------------Index Route------------------------
  //this will show us all the listings that are added by default
  

  .get(wrapAsync(listingController.index))

  //------------------------Create Route-----------------------------
  //this will actually add a new listing using a POST request after validating it
  // .post(
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
  // )
  .post(upload.single('listing[image]'), (req, res) => {
    res.send(req.file);
  });
//********************************************************************************************************** */
//--------------------------New Route----------------------------
//this route will take you to a page where you can add your own listing
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")

  //--------------------------Show Route----------------------------
  //this will show a particular listing that has been clicked upon - READ
.get(wrapAsync(listingController.showListing))
//--------------------------Update Route----------------------------------
//this route will help redirect from the edit route and it will put the newly updated listing on the homepage after validating the request
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
)

//-------------------------Delete Route--------------------------------------------
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);




//--------------------------Edit Route-----------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
