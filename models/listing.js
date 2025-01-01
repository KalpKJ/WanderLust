/*This file is basically the list of data of
  that will be in one card of our website
*/

//required mongoose because we will be storing data in MongoDB
const mongoose = require("mongoose");
const Review = require("./review");

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
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
    
});

//making a new model i.e a group od items that uses above defined schema
const Listing = mongoose.model("Listing", listingSchema);

//exporting that model so that other files could use the data storing in it
module.exports = Listing;