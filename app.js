const express = require("express"); //to start localhost server
const app = express(); //storing it in a variable
const mongoose = require("mongoose"); //required to interact with Database
const Listing = require("./models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file
const path  = require("path"); //this is required to access '.ejs' files here

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

//setting the view engine to ejs so that the ejs file is shown when the server is loaded
app.set("view engine", "ejs");

//this code find a directory name "views" to look for our ejs file
app.set("views", path.join(__dirname, "views"));

//this line of code is required when you want to get data (id) from the search query
//from the url of the request it can return us the parameters passed into it
app.use(express.urlencoded({extended: true}));

//root API
app.get("/", (req,res) =>{
    res.send("Hi I am root");
});


//-------------------Index Route------------------------
//this will show us all the listings that are added by default
app.get("/listings", async (req, res) => {

  //this is finding all the listings stored in 'Listing' model of DB 
  const allListings = await Listing.find({});

  //we are rendering the html page through 'index.ejs' and passing in the all the listings to use in that file
  res.render("./listings/index.ejs", {allListings});
});

//--------------------------Show Route----------------------------
//this will show a particular listing that has been clicked upon - READ
app.get("/listings/:id", async (req,res )=> {

    //storing the id in a variable that is coming as parameters in request
    let {id} = req.params;

    //finding the particular listing stored in out DB using the id
    const listing = await Listing.findById(id);

    //rendering the 'show.ejs' file whenever a link is clicked upon and passing the details of listing to the file
    res.render("./listings/show.ejs", {listing} )
})

//making the server listen to port 8080
app.listen(8080, () =>{
    console.log("server is listening to port 8080");
})