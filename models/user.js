//required mongoose because we will be storing data in MongoDB
const mongoose = require("mongoose");

//storing the schema in a variable
const Schema = mongoose.Schema; 

//required to make the user login page
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);