/*This file is basically the list of data of
  that will be in one card of our website
*/

//required mongoose because we will be storing data in MongoDB
const mongoose = require("mongoose");
const review = require("./review");

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
        filename: {
            type: String,
            default: "defaultimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1589419896452-b460b8b390a3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

//making a new model i.e a group od items that uses above defined schema
const Listing = mongoose.model("Listing", listingSchema);

//exporting that model so that other files could use the data storing in it
module.exports = Listing;