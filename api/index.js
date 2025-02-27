import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../api/routes/userRoute.js";
import authRoute from "../api/routes/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import listingRoute from "../api/routes/listingRoute.js";
import path from "path";



// Initialize dotenv
dotenv.config();



// Mongoose connection
mongoose
  .connect(process.env.MONGO
  )
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
  const __dirname = path.resolve();
// Express app initialization
const app = express();

// CORS setup
app.use(
  cors({
    origin: "https://your-real-estate.onrender.com", // Replace with your frontend origin
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


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

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
