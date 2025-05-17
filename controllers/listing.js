const Listing = require("../models/listing");
//geocoding maps 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const mapToken = proccess.env.MAP_TOKEN  - if we had used mapbox for showing map
//const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });
// if we had used mapbox for showing map

//index route- index func here is - callback of listing 
module.exports.index = async (req, res)=>{
   const allListings = await  Listing.find({});
  // console.log(allListings);
res.render("listings/index.ejs", {allListings} ); 
};

//new route callback
module.exports.renderNewForm = (req,res)=>{    
    res.render("listings/new.ejs");
};

//show route caallbck
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({path : "reviews",
     populate:{ path: "author"}, }) //nested populate
   .populate("owner"); //chaining populte
   if(!listing){
    req.flash("error","Listing doesnt exist!" );
    res.redirect("/listings");
   }else{
         res.render("listings/show.ejs", {listing} ); 
   }
 // console.log(listing);
};

//create route callback 
module.exports.createListing =  async (req,res, next)=>{
    // try{
         //let listingD = req.body.listing;

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data");
    // }
    //  let result =  listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error ); 
    // }
//    const newList =  new Listing(req.body.listing);
//    await newList.save();
   // console.log(newList);
//    res.redirect("/listings"); 
    // }catch(err){
    //     next(err);
    // }
    /*
    code for geocoding if we had used mapbox
    
    let reponse = await geocodingClient
    .forwardGeocode({
    //query:"New Delhi, India",
    query : req.body.listing.location, 
    limit : 1
    })
    .send();
    console.log(response.body.features[0].geometry);
     //prints on console  type:"Point", coordinates: {{long, lat  }}
    res.send("done");
    
    */
   
   let url =  req.file.path;
   let filename = req.file.filename; 
   console.log(url, "..", filename); 

const newList =  new Listing(req.body.listing);
        //console.log(req.user);
       newList.owner= req.user._id; 
      newList.image = {url , filename }; 
     // newList.geometry = response.body.features[0].geometry; // geocoding mapbox
  let savedListing =  await newList.save();
  //console.log(savedListing);
   req.flash("success","New listing created!" );
 res.redirect("/listings"); 

}; 
//edit callback
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
    req.flash("error","Listing doesnt exist!" );
    res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit.ejs", {listing, originalImageUrl});
   
    
}; 
//update callback
module.exports.updateListing = async (req,res)=>{
    //  if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data");
    // }
    let {id} = req.params;

   //setting authorization
//  let listing = await  Listing.findById(id);
//  if(!listing.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error", "You dont have permission to edit");
//    return  res.redirect(`/listings/${id}`);
//  }  instead of making code lengthy, use middleware isOwner 

  let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    //deconstructed req body, listing objects to get individual fiels

    //for saving the uploaded file
    if(typeof req.user !== "undefined"){
         let url =  req.file.path;
   let filename = req.file.filename; 
  listing.image = {url, filename}; 
  await listing.save();
    }
   
    req.flash("success","listing updated!" );
    res.redirect(`/listings/${id}`);
};

//delete callback
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
  let deletedlisting = await  Listing.findByIdAndDelete(id);
  console.log("deleted listing");
  req.flash("success"," listing deleted!" );
  res.redirect("/listings");
}; 