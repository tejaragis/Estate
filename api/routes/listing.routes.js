const express=require('express');
const { verifytoken } = require("../utils/verify.js");
const {createListing,deleteListing,updateListing,getListings,getListing}= require("../controller/listing.controller.js")
const route=express.Router();

route.post('/create',verifytoken,createListing);
route.delete('/delete/:id',verifytoken,deleteListing);
route.post("/update/:id",verifytoken,updateListing);
route.get("/get/:id",verifytoken,getListings);
route.get("/get",getListing);
module.exports=route;
