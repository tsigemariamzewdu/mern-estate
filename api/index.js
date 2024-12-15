import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../api/routes/userRoute.js"
import authRoute from "../api/routes/authRoute.js"
import cors from "cors";

dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to MonoDB")
}).catch((error)=>{
    console.log(error)
})



const app=express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies or other credentials

}))

app.listen(5000,()=>{
    console.log("server is listening on port 3000")
})

app.use('/api/user',userRoute);
app.use("/api/auth",authRoute);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode|| 500;
    const message =err.message || "internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});

