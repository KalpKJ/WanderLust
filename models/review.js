//required mongoose because we will be storing data in MongoDB
const mongoose = require("mongoose");

//storing the schema in a variable
const Schema = mongoose.Schema; 

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
module.exports = mongoose.model("Review", reviewSchema);