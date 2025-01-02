const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

module.exports.index = async (req, res) => {
  //this is finding all the listings stored in 'Listing' model of DB
  const allListings = await Listing.find({});

  //we are rendering the html page through 'index.ejs' and passing in the all the listings to use in that file
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  //storing the id in a variable that is coming as parameters in request
  let { id } = req.params;

  //finding the particular listing stored in out DB using the id
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }

  //rendering the 'show.ejs' file whenever a link is clicked upon and passing the details of listing to the file
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Added");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  //storing the id in a variable that is coming as parameters in request
  let { id } = req.params;

  //finding the particular listing stored in out DB using the id
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  //this will find the id and update the new changes by deconstructing the old ones
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
  
  req.flash("success", "Listing Updated");

  //redirecting to the same listing
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
