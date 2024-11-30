const errorhandler = require("../utils/error");
const bcrypt=require("bcryptjs");
const User=require("../model/users.model.js");
const Listing = require("../model/listing.model.js");

const updateuser=async (req,res,next)=>{
   if(req.user.id!=req.params.id){

    return next(errorhandler(404,"you can only authenticate only your account"))

   }
   try{
      if(req.body.password){
         req.body.password=bcrypt.hashSync(req.body.password,10);

      }
     
     const updateduser= await User.findByIdAndUpdate(req.params.id,{
         $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar

         }
      },{new:true})
     const {password,...rest}=updateduser._doc;
     res.status(200).json(rest);
   }catch(error){
      console.log("error inside update user");
      next(error)
   }
}
const deleteuser=async (req,res,next)=>{
   if(req.user.id!==req.params.id){
      return next(errorhandler(404,"you can only delete only your account"))
   }
   try{
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('accesstoken');
      res.status(200).json(`User ${req.params.id} deleted from database`);
   }catch(error){
      next(error);
   }
}
const getUserListing=async(req,res,next)=>{
   
   if(req.user.id==req.params.id){
      try{
         const listing= await Listing.find({userRef:req.params.id})
        res.status(201).json(listing);
      }catch(error){
         next(error)
      }
      
   }
   else{
      next(errorhandler(404,"You can only view listing for your account"));
   }
}
const getuser=async(req,res,next)=>{
   try{
      const user=await User.findById(req.params.id);
   if(!user){
      return next(errorhandler(404,"user not found"))
   }
   const{password:pass,...rest}=user._doc;
   res.status(200).json(rest);
   }catch(error){
      next(error)
   }
   
}

module.exports={
   updateuser,deleteuser,getUserListing,getuser
}