const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title :{
        type : String,
        required : true,
    } ,
    description: String,
    image: {
        url : String ,
        filename : String,
    },
    price: Number,
    location: String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review", //model name 
        },
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    //if we had mapbox 
//     geometry: {
//     type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }, 
// }, 
});

//post middleware to handle deletion of listings and its corresponding
//reviews
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
         await Review.deleteMany({_id : {$in: listing.reviews}});
    }
   
});


const Listing = mongoose.model("Listing", listingSchema );
module.exports = Listing;

/* previous schema - image
type: String,
        //when img is not set , default use,  img doesnt exist only 
        default : 
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //when image is there but not present
        //set for  client
        set : (v)=> v ==="" ? "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        : v,
        */