import User from "../models/UserModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: "hello world",
    });
};

export const updateUser = async (req, res, next) => {
    // Check if the logged-in user ID matches the ID in the request params
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account"));
    }

    try {
        // Hash the password if it is being updated
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Perform the update operation
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username, // Fixed typo here
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true } // Ensures updated document is returned
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return next(errorHandler(404, "User not found"));
        }

        // Exclude the password from the response
        const { password, ...rest } = updatedUser._doc;

        // Send the updated user data in the response
        res.status(200).json(rest);
    } catch (error) {
        // Pass the error to the error handler
        console.log(error)
        next(error);
    }
};
export const deleteUser=async(req,res,next)=>{
if(req.user.id!==req.params.id){
    return next(errorHandler(401,"you can only delete your own account"))
}try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"user has been deleted"})

    }catch(error){
        next(error)

    }


}
