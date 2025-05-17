const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError = require("../utils/ExpressError.js");
//requiring review model
const Review = require("../models/reviews.js");

const {reviewSchema} =  require("../schema.js");
const Listing = require("../models/listing.js"); 


const {isLoggedIn ,validateReview, isOwner, isrewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//route to add a new review - post route
// req will be async caz we will be storing in our db
router.post("/", isLoggedIn, 
    validateReview,
     wrapAsync( reviewController.createReview));

//Delete route for reviews
router.delete("/:reviewid", 
    isLoggedIn, isrewAuthor, 
    wrapAsync(reviewController.deleteReview));

module.exports = router;
