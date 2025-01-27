import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../api/routes/userRoute.js";
import authRoute from "../api/routes/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import listingRoute from "../api/routes/listingRoute.js"



// Initialize dotenv
dotenv.config();



// Mongoose connection
mongoose
  .connect("mongodb://localhost:27017/mernestate"
  )
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

// Express app initialization
const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies or other credentials
  })
);

// Body parser
app.use(express.json());

//using cookie parser

app.use(cookieParser())



// Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing",listingRoute);

// Default error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
