import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../api/routes/userRoute.js"

dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to MonoDB")
}).catch((error)=>{
    console.log(error)
})



const app=express();

app.listen(3000,()=>{
    console.log("server is listening on port 3000")
})

app.use('/api/user',userRoute)

