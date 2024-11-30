const express=require("express");
const test=require("../controller/user.controller")

const {updateuser,deleteuser,getUserListing,getuser}=require("../controller/user.controller.js");
const { verifytoken } = require("../utils/verify.js");
  const router=express.Router();

router.post("/update/:id",verifytoken,updateuser);
router.delete("/delete/:id",verifytoken,deleteuser)
router.get("/listing/:id",verifytoken,getUserListing)
router.get("/:id",verifytoken,getuser)
 
module.exports=router;