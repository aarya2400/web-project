const User = require("../models/user.js");

module.exports.renderSignupForm =  (req,res)=>{
    res.render("users/signup.ejs");
}; 

module.exports.signUp = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
   const newUser =  new User ({username, email});
   //to reg this new user into db
  const registeredUser =   await User.register(newUser, password);
  console.log(registeredUser);
  //automatic login after signup
  req.login(registeredUser, (err)=>{
    if(err){
        return next(err);
    }else{
         req.flash("success", "Welcome to wanderlust ! ");
       res.redirect("/listings");
       
    }
  }  );
  
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
  
} ;

module.exports.afterLoginpage = async(req,res)=>{
        req.flash("success","Welcome to wanderlust. You are logged in !"); 
      //  res.redirect("/listings");
      // we wanna redirect user to where it was
      let redirectUrl = res.locals.redirectUrl || "/listings" ;
       res.redirect(redirectUrl);
    };

    module.exports.logout= (req,res, next)=>{
    req.logout((err)=>{
        if(err) {
          return  next(err);
        }
        req.flash("success", "you are logged out now"); 
        res.redirect("/listings");
    });
};
