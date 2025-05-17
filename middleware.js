const Listing= require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} =  require("./schema.js");

//requiring review model
const Review = require("./models/reviews.js");



module.exports.isLoggedIn = (req,res,next)=>{
   // console.log(req.user); 
   console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        //logic of user to be redirected where it was
        req.session.redirectUrl = req.originalUrl;
        //created a variable redirectUr; in req.session attribute
        //so that all middlewares and us can access it when needed.

        req.flash("error", "you must be logged in to create listing.");
        return  res.redirect("/login"); 
    }
    next();
};
//logic to return to same page where we were after logging in 
module.exports.saveRedirectUrl = (req, res, next )=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner =async (req,res,next)=>{
     let {id} = req.params;
    let listing = await  Listing.findById(id);
 if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You dont have permission");
   return  res.redirect(`/listings/${id}`);
 } 
 next();
}; 

//validate func for listing - server side validation 
module.exports.validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
};

//validate func for review - server side validation 
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
};
module.exports.isrewAuthor =async (req,res,next)=>{
     let {id, reviewid} = req.params;
    let review = await  Review.findById(reviewid);
 if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author");
   return  res.redirect(`/listings/${id}`);
 } 
 next();
}; 