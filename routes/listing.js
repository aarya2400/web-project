
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); 
const wrapAsync = require("../utils/wrapAsync.js"); 
// const {listingSchema, reviewSchema} =  require("../schema.js");
const {listingSchema} =  require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");

//parser for uploaded files
const multer  = require('multer'); 
const {storage} = require("../cloudConfig.js"); 
// const upload = multer({ dest: 'uploads/'});
const upload = multer({ storage}); //multer store file in cloudinary storage

const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//requiring async callbacks from controllers of listings
const ListingController = require("../controllers/listing.js");


//using router.route for path "/"
router.route("/")
.get( wrapAsync(ListingController.index)) //index
.post(isLoggedIn, 
   //   validateListing, //passed asa middleware
     upload.single('listing[image]'), 
     validateListing, //passed asa middleware
    wrapAsync(ListingController.createListing) //create
   );
// .post(  , (req,res)=>{
//    res.send(req.file); 
// });


//new route - write before :id caz after :id, it may interpret new as an id causing error
router.get("/new", isLoggedIn, ListingController.renderNewForm ) ;

//using router.route for path "/:id"
router.route("/:id")
.get(wrapAsync( ListingController.showListing )) //show
.put(isLoggedIn, isOwner, 
    upload.single('listing[image]'), 
   validateListing,
   wrapAsync( ListingController.updateListing )) //update
.delete( isLoggedIn, isOwner, 
   wrapAsync (ListingController.deleteListing)); //delete


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, 
    wrapAsync( ListingController.editListing));


module.exports = router;

//index route 
/*async (req, res)=>{
   const allListings = await  Listing.find({});
  // console.log(allListings);
res.render("listings/index.ejs", {allListings} ); 
}  this callback is in controller now with a func name - index*/ 
/// we sent index func in wrapasync[for async error handling] 
// router.get("/", wrapAsync(ListingController.index));





//show route 
// router.get("/:id",wrapAsync( ListingController.showListing )) ;



//create route new listing  
// router.post("/", isLoggedIn, 
//      validateListing, //passed asa middleware
//     wrapAsync(ListingController.createListing));
 




//update route 
// router.put("/:id", isLoggedIn, isOwner, validateListing,
//    wrapAsync( ListingController.updateListing )) ;

//delete route 
// router.delete("/:id", isLoggedIn, isOwner, 
//    wrapAsync (ListingController.deleteListing));

