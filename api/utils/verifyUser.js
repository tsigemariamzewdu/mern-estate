import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(errorHandler(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "mysecret");
        req.user = decoded; // Populate req.user with decoded token data (e.g., id)
        next();
    } catch (error) {
        console.log(error)
        next(errorHandler(403, "Invalid token"));
    }
};
