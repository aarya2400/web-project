const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//router.route for path "/signup"
router.route("/signup")
.get( userController.renderSignupForm )
.post( wrapAsync(userController.signUp ) );

router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post( saveRedirectUrl, 
    passport.authenticate("local", //passport is doing the login thing 
    {failureRedirect: '/login', failureFlash : true}
    ),  
   userController.afterLoginpage );

//logout functionality
router.get("/logout", userController.logout );

module.exports = router;



//taking info from user for signup
// router.get("/signup", userController.renderSignupForm );

//post rq- saving this signup user info to db
// router.post("/signup",wrapAsync(userController.signUp ) );

//login get req
// router.get("/login", (req,res)=>{
//     res.render("users/login.ejs");
// }); 

//post req login
// router.post("/login",
//     saveRedirectUrl, 
//     passport.authenticate("local", //passport is doing the login thing 
//     {failureRedirect: '/login', failureFlash : true}
//     ),  
//    userController.afterLoginpage );
   //afterloginpage redirects uder back to where it was after logging in 




