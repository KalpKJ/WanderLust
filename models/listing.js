/*This file is basically the list of data of
  that will be in one card of our website
*/

//required mongoose because we will be storing data in MongoDB
const mongoose = require("mongoose");

//storing the schema in a variable
const Schema = mongoose.Schema; 

//defining our schema
//here we are declaring what kind of data we want to store in out DB
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI",
        set: (v) => v ==="" 
        ? "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI"
        : v
    },
    price: Number,
    location: String,
    country: String
});

//making a new model i.e a group od items that uses above defined schema
const Listing = mongoose.model("Listing", listingSchema);

//exporting that model so that other files could use the data storing in it
module.exports = Listing;