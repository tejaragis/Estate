const User=require("../model/users.model.js");
 const bcrypt=require("bcryptjs");
 const errorhandler=require("../utils/error.js");
 const jwt=require("jsonwebtoken");
const signUP=async (req,res,next)=>{
    const {username,password,email}=req.body; //object destructing
      const hashpassword=bcrypt.hashSync(password,10);
    const newuser=new User({username,password:hashpassword,email}); //new User is making instance of model.here we are getting username and email values above const username and email which is username=req.body.username,and password we are giving hashedpassword 
    try{
        await newuser.save();
        
    res.status(201).json("User Created Successfully");
    }
    catch(err){
        next(err);
        console.log(err);
    }
}
const signIn=async(req,res,next)=>{
    const{username,password}=req.body;
   
    try{
        const validateuser=await User.findOne({username:username});
        
        if(!validateuser){
            return next(errorhandler(404,'user not found'));
        }

        const validpassword=bcrypt.compareSync(password,validateuser.password);
        
        if(!validpassword){
            return next(errorhandler(401,'Invalid password.Password not matched '))
        }
         const token=jwt.sign({id:validateuser._id},process.env.JWT_SECRET);
         // this line includes destructing renaming the variable
         // In JavaScript destructuring, the syntax password: pass means extract the password field from the object[validteuser_.doc (doc isconverting into documentin mongoose)]  and assign its value to a new variable called pass.
         //basically here weare renaming the passowrd too pass .normall destruncting is like const[a,b]=obj. but here are we are doing const [a:a1,b]=obj a is renamed as a1
         const{password:pass,...rest}=validateuser._doc; 
         console.log("pass",pass);
         res.cookie('accesstoken',token,{httpOnly:true}).status(200).json(rest);
        res.status(200).json({
            sucess: true,
            message: 'User successfully signed in',
        });
    }catch(error){
        next(error);
    }
}
 const googlesignin= async (req,res,next)=>{
  try{
    const user= await User.findOne({email:req.body.email})
    if(user){ //if user exists
        
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=user._doc;
       res.cookie("accesstoken",token,{httpOnly:true})
           .status(200)
           .json(rest);
    }
    else{ // if user not exist ,register
       const generatepassword=Math.random().toString(36).slice(-8);
       const hashedpassword=bcrypt.hashSync(generatepassword,10);
       const newuser=new User({username:req.body.name.split(' ').join("").toLowerCase()+Math.random().toString(36).slice(-8),email:req.body.email,password:hashedpassword,avatar:req.body.photo})
       await newuser.save();
       const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET);
       const {password:pass,...rest}=newuser._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

    }
  }catch(error){
    next(error)
  }
 }
 const SignOut=async (req,res,next)=>{
 try{
  res.clearCookie('accesstoken');
  res.status(200).json('user has been logged out');
 }catch(error){
    next(error);
 }
 }
module.exports={
    signUP,signIn,googlesignin,SignOut
};