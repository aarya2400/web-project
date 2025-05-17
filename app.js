
//accessing environment variables from .env file
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js"); 
//const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError = require("./utils/ExpressError.js");
//requiring review model
//const Review = require("./models/reviews.js");

const methodOverride = require("method-override");
const path = require("path");

//this is for server side validation , requiring joi schema
//const {listingSchema, reviewSchema} =  require("./schema.js");

//requiring listing.js - express router
const listingRouter = require("./routes/listing.js");
// express router - reviews
const reviewRouter = require("./routes/review.js");
//express-router - users
const userRouter = require("./routes/user.js");



//using session- by express
const session = require("express-session");
//connect-mongo
const MongoStore = require('connect-mongo');

//using flash
const flash = require("connect-flash");

//passportLocalMongoose - for authorize, authenticate, hashing, salting
const passport = require("passport");
const LocalStrategy = require("passport-local");
//requiring user model 
const User = require("./models/user.js");


//requiring ejs mate
const ejsMate = require("ejs-mate");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to db"); 
}).catch(err=>{
    console.log(err);
}); 

async function main(){
   // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views" ));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method")); 

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


//mongo-connect 
const store = MongoStore.create({
    mongoUrl : dbUrl,//db ka url 
    crypto : {
        secret: process.env.SECRET, 
    },
    touchAfter: 24*3600,
}); 

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
}); 

const sessionOptions = {
    store,  
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, //for an week
        maxAge : 7 *24*60*60*1000,
        httpOnly : true, 
    },
};






 app.get("/", (req,res)=>{
     res.redirect("/listings");
 });


app.use(session(sessionOptions));
// to check if session is establish, go to browser on our main page
//check console, applications, if u see connect_sid, it means session successfull.
app.use(flash());
//always write flash after app.use session
//and before our routes , express router 

//passport - initialization middleware
app.use(passport.initialize());
app.use(passport.session());// this helps browser know if same user is accessing browser on diff tabs.
passport.use(new LocalStrategy(User.authenticate()));
//user.authenticate means login/signup user - static method 

passport.serializeUser(User.serializeUser());//storing related info of user in session
passport.deserializeUser(User.deserializeUser());// not storing/removing related info of user after session ends




//middleware of flash to be written just before our express routers route
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
   //  console.log(res.locals.success);

   res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // accessing req.user for navbar.ejs
    //to add functionality of showing signup/login/logout opt

    next(); // imp to call next 
}); 




//demo user - passport
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username: "delta-student",
//     });

//   let registeredUser =  await User.register(fakeUser, "helloworld" );
//   res.send(registeredUser);
// });


//express router 
app.use("/listings", listingRouter);

//express router - reviews
app.use("/listings/:id/reviews", reviewRouter);

//express-router - users
app.use("/", userRouter);

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new home",
//         description : "By the beach",
//         price : 2000,
//         location : "Calicut, Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved"); 
//     res.send("successful testing "); 
// });





//custom response when req not match any of above
// app.all("*",(req, res, next)=>{
//     next(new ExpressError(404,"Page not found" )); 
// }); 

//custom error handler
app.use((err,req,res,next)=>{
   let {statusCode=500, message="something went wrong "} = err;
   res.status(statusCode).render("error.ejs",{message}); 

   // res.status(statusCode).send(message);
   // res.send("SOmething went wrong");
});

app.listen(port, ()=>{
    console.log("server is listening to port 3000");
});
