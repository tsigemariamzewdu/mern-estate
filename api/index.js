import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../api/routes/userRoute.js"
import authRoute from "../api/routes/authRoute.js"

dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to MonoDB")
}).catch((error)=>{
    console.log(error)
})



const app=express();

app.use(express.json())

app.listen(6000,()=>{
    console.log("server is listening on port 3000")
})

app.use('/api/user',userRoute);
app.use("/api/auth",authRoute);

