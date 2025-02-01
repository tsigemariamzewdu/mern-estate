import Listing from "../models/ListingModel.js"
import { errorHandler } from "../utils/error.js";

export const createListing=async (req,res,next)=>{
    try {
       const listing =await Listing.create(req.body);
       return res.status(201).json(listing)
    } catch (error) {
        next(error)
        
    }
}
export const deleteListing=async (req,res,next)=>{
    const listing=await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404,'listing not found'))


    }
    if(req.user.id!==listing.userRef){
        return next(errorHandler(401,"you can only delete your own listings"))

    }
    try {
      await listing.findByIdAndDelete(req.params.id)
      res.status(200).json("Listing has been deleted")
    } catch (error) {
        next(error)
    }
}