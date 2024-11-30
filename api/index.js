
const express=require("express");
const mongoose=require("mongoose");
const path = require("path");
const userRouter=require("./routes/user.routes");
const UserAuthRouter=require("./routes/auth.routes");
const ListingRouter=require("./routes/listing.routes");
const cors = require('cors');
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.MONGO).then(()=>{console.log("connected")}).catch(err=>console.log(err.message));

const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use("/api/user",userRouter);
app.use("/api/auth",UserAuthRouter);
app.use("/api/listing",ListingRouter);
// error handling middleware this will be used when in code and other files called with next(error). 
app.use((err,req,res,next)=>{
    const statusCode=err.statuscode||500;
    const Message=err.message||"internal server error";
    return res.status(statusCode).json({
        sucess:false,
        statuscode:statusCode,
        message:Message,
    })
})
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("server started running on port 3000");
})