import express from "express";
import { signup,signin, google } from "../controller/authContoller.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google)

export default router;