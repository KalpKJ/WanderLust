const Listing = require("../models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

module.exports.index = async (req, res) => {
    //this is finding all the listings stored in 'Listing' model of DB
    const allListings = await Listing.find({});

    //we are rendering the html page through 'index.ejs' and passing in the all the listings to use in that file
    res.render("./listings/index.ejs", { allListings });
};