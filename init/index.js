/**
 * What we are doing here: Filling the database with some 
 * pre-generated data so that it does not look empty
*/

//requiring everything that we are going to need
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


//-------------------pasted from app.js--------------------------

//this url that you get from MongoDB website
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
//then method for promises
.then(() =>{
    console.log("connected to DB"); 
})
//catching any errors
.catch((err) =>{
    console.log(err);
});

//an async function to connect your JS file with MongoDB
async function main(){
    await mongoose.connect(MONGO_URL);
}
//-------------------pasted from app.js--------------------------

//initialising the database with the data
const initDB = async () =>{

    //cleaning the already existing data
    await Listing.deleteMany({});

    //inserting all the data that the file received from "data.js"
    await Listing.insertMany(initData.data);

    console.log("data was initialized");
};

initDB();
