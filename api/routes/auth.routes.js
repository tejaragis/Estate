const express=require("express");
const {signUP,signIn,googlesignin,SignOut}=require("../controller/auth.controller.js")

const route=express.Router();
route.post("/signUP",signUP);
route.post('/signIn',signIn);
route.post('/google',googlesignin);
route.get('/signout',SignOut)
module.exports=route;