const express = require("express"); //to start localhost server
const app = express(); //storing it in a variable
const mongoose = require("mongoose"); //required to interact with Database
const Listing = require("./models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file

//this url that you get from MongoDB website
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//calling the main function
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

//root API
app.get("/", (req,res) =>{
    res.send("Hi I am root");
});

//making another API to test
//here we are creating a sample listing in an async function and waiting for it to save it in the DB
app.get("/testListing", async (req, res)=>{
    let sampleListing = new Listing({
        title: "My Villa",
        description: "in the woods",
        price: 1200,
        location: "Banff, Alberta",
        country: "Canada"
    })

    //waiting for it to get saved in Data base
    await sampleListing.save();
    console.log("sample was saved");
    res.send("succesful testing");
});

//making the server listen to port 8080
app.listen(8080, () =>{
    console.log("server is listening to port 8080");
})