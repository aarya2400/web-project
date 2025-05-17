const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview =  async (req,res)=>{
        console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
        newReview.author = req.user._id; 
    listing.reviews.push(newReview); //pushing the review to its specififc id's review field
       // console.log(newReview); 

   await newReview.save();
   await listing.save();
   console.log("new review saved");
   // res.send("new review saved");
   req.flash("success","New review created!" ); 
   res.redirect(`/listings/${listing._id}`); 
};

module.exports.deleteReview = async (req,res)=>{
    let {id, reviewid} = req.params;

   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
   await Review.findByIdAndDelete(reviewid);
   req.flash("success","Review deleted!" );
   res.redirect(`/listings/${id}`); 
}; 