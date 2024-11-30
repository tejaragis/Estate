  const Listing=require('../model/listing.model.js');
const errorhandler = require('../utils/error.js');
const createListing=async(req,res,next)=>{
    try{
       const listing=await Listing.create(req.body);
       res.status(201).json(listing);
    }catch(error){
        next(error);
    }
}
const deleteListing=async (req,res,next)=>{
   const listing= await Listing.findById(req.params.id)
   if(!listing){
    next(errorhandler(404,`Listing by id not found`))
   }
   if(req.user.id!=listing.userRef){
      next(errorhandler(401,"you can only delete your own listing"))
   }
    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("selected listing deleted successfully")
   }catch(error){
    next(error)
   }
}
const updateListing=async (req,res,next)=>{
 const listing=await Listing.findById(req.params.id);
 if(!listing){
    next(errorhandler(404,"Listing by provided id not found"));
 }
 if(req.user.id!=listing.userRef){
    next(errorhandler(401,"You can only update your own listing"));
 }
 try{
   const updatelist=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})
   res.status(200).json(updatelist);
 }catch(error){
    next(error)
 }
}
const getListings=async(req,res,next)=>{
   const listing= await Listing.findById(req.params.id);
   if(!listing){
      next(errorhandler(401,"listing not found"));
   }
   try{
      res.status(200).json(listing);
   }catch(error){
      next(error);
   }
}
const getListing=async(req,res,next)=>{
   try{
      let limit=parseInt(req.query.limit)||9;
      let StartIndex=parseInt(req.query.StartIndex)||0;
      let offer=req.query.offer;
      if(offer==undefined ||offer=="false"){
         offer={$in:[true,false]};
      }
      let furnished=req.query.furnished;
      if(furnished==undefined||offer=="false"){
         furnished={$in:[true,false]}
      }
      let parking=req.query.parking;
      if(parking==undefined||parking=="false"){
         parking={$in:[true,false]}
      }
      let type=req.query.type;
      if(type==undefined||type=="all"){
         type={$in:["rent","sale"]}
      }
      
      let searchTerm=req.query.searchTerm||" ";
     let sort=req.query.sort||"createdAt";
      let order=req.query.order||"desc";
      const listing= await Listing.find({
         name:{$regex:searchTerm,$options:"i"},
         offer,furnished,parking,type,
      }).sort(
         {[sort]:order}
      ).limit(limit).skip(StartIndex);
       res.status(200).json(listing);
   }catch(error){
      next(error);
   }
}
module.exports={
    createListing,deleteListing,updateListing,getListings,getListing
}