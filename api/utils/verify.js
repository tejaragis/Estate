const errorhandler=require("./error.js");
const jwt=require("jsonwebtoken");
 const verifytoken=(req,res,next)=>{
    const token=req.cookies.accesstoken;
    
     if(!token){
        next(errorhandler(401,"unauthorized"));
     }
     jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
           if(err){
             
            next(errorhandler(401,"forbidden"));
           }
          
           req.user=user; //here we are only sending id from jwt.
           next();
     })      
 }
 module.exports={
    verifytoken
 }