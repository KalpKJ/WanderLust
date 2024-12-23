const express = require("express"); //to start localhost server
const app = express(); //storing it in a variable
const mongoose = require("mongoose"); //required to interact with Database
const Listing = require("./models/listing.js"); //requiring the Listing that are being exported by the  "listing.js" file
const path  = require("path"); //this is required to access '.ejs' files here
const methodOverride = require("method-override"); //required for PUT/DELETE requests in forms in any .ejs file
const ejsMate = require("ejs-mate") //required for better templating/layout
const wrapAsync = require("./utils/wrapAsync.js"); //it is an async functions which takes another functions as @params and catches errors
const ExpressError = require ("./utils/ExpressErrors.js"); //to handle errors thrown by Express
const {listingSchema, reviewSchema} = require("./schema.js");//a joi package that checks if the data that client sent has a valid schema or not
const Review = require("./models/review.js") ////requiring the Review that are being exported by the  "review.js" file

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

//a function that uses joi to validate listing on server side
const validateListing = (req, res, next) =>{

    //extracting if there is any error from the request body using joi
    let {error} = listingSchema.validate(req.body);

    //if there is error we will throw our ExpressError
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{//else we will call next middleware
        next();
    }
}

//a function that uses joi to validate reviews on server side
const validateReview = (req, res, next) =>{

    //extracting if there is any error from the request body using joi
    let {error} = reviewSchema.validate(req.body);

    //if there is error we will throw our ExpressError
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{//else we will call next middleware
        next();
    }
}

//-------------------Index Route------------------------
//this will show us all the listings that are added by default
app.get("/listings", wrapAsync(async (req, res) => {

  //this is finding all the listings stored in 'Listing' model of DB 
  const allListings = await Listing.find({});

  //we are rendering the html page through 'index.ejs' and passing in the all the listings to use in that file
  res.render("./listings/index.ejs", {allListings});
}));


//--------------------------New Route----------------------------
//this route will take you to a page where you can add your own listing 
app.get("/listings/new", (req, res) =>{
    res.render("./listings/new.ejs")
});
//------------------------Create Route-----------------------------
//this will actually add a new listing using a POST request after validating it
app.post(
  "/listings", validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);


//--------------------------Edit Route-----------------------------------
app.get("/listings/:id/edit", wrapAsync(async (req, res) =>{
    //storing the id in a variable that is coming as parameters in request
    let {id} = req.params;

    //finding the particular listing stored in out DB using the id
    const listing = await Listing.findById(id);

    res.render("./listings/edit.ejs", {listing});
     
}));
//--------------------------Update Route----------------------------------
//this route will help redirect from the edit route and it will put the newly updated listing on the homepage after validating the request
app.put("/listings/:id", 
    validateListing,
    wrapAsync(async (req, res) =>{
    let { id } = req.params;

    //this will find the id and update the new changes by deconstructing the old ones
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    //redirecting to the same listing
    res.redirect(`/listings/${id}`);
}));


//-------------------------Delete Route--------------------------------------------
app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//--------------------------Show Route----------------------------
//this will show a particular listing that has been clicked upon - READ
app.get("/listings/:id", wrapAsync(async (req,res )=> {

    //storing the id in a variable that is coming as parameters in request
    let {id} = req.params;

    //finding the particular listing stored in out DB using the id
    const listing = await Listing.findById(id).populate("reviews");

    //rendering the 'show.ejs' file whenever a link is clicked upon and passing the details of listing to the file
    res.render("./listings/show.ejs", {listing} )
}));

//----------***************Reviews***********-------------------------- 
// -------------------(Post Review Route)------------------------------------
//this route will be together with '/listings' route as listings and reviews has one to many relationship
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    //first finding the listing using the id
    let listing = await Listing.findById(req.params.id);

    //then extracting the review that came in the body of the request
    let newReview = new Review(req.body.review);

    //pushing the review into the DB of listings
    listing.reviews.push(newReview);

    //saving the new review
    await newReview.save();

    //updating the listings collections
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//---------------------------(Delete Review Route)---------------------------------
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);


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