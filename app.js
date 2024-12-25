const express = require("express"); //to start localhost server
const app = express(); //storing it in a variable
const mongoose = require("mongoose"); //required to interact with Database
const path  = require("path"); //this is required to access '.ejs' files here
const methodOverride = require("method-override"); //required for PUT/DELETE requests in forms in any .ejs file
const ejsMate = require("ejs-mate") //required for better templating/layout
const ExpressError = require ("./utils/ExpressErrors.js"); //to handle errors thrown by Express


const listings = require("./routes/listing.js"); //getting all the routes from 'listing.js' file
const reviews = require("./routes/review.js"); //getting all the routes from 'review.js' file

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

//using the 'method-override' package
app.use(methodOverride("_method"));

//setting ejs-mate as an engine
app.engine("ejs", ejsMate);

//this code is required to access static files like css from the public folder
app.use(express.static(path.join(__dirname, "/public")));

//root API
app.get("/", (req,res) =>{
    res.send("Hi I am root");
});




//--*****************Listings*****************----------------------------------------------------
//instead of using all the routes in its seperate functions, we are just using this one line of code
// because we moved all the functions to a different file and exported it
app.use("/listings", listings);


//--*****************Reviews*****************----------------------------------------------------
app.use("/listings/:id/reviews", reviews)




//if the path entered by the user does not match any of the above mentioned path then
app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page not found"));//throwing this error
});


//--------------Defining error handling middlewares------------------------
//this function has an 'err' as a parameter hence it will handle errors
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err; //deconstructing status code and message from error
    res.status(statusCode).render("error.ejs" , {message})
   // res.status(statusCode).send(message);//setting that status code and message to our response
});


//making the server listen to port 8080
app.listen(8080, () =>{
    console.log("server is listening to port 8080");
})