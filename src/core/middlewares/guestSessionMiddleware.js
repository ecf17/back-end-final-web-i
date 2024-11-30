import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export default function guestSessionMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        }

        let sessionId = req.cookies.session_id;

        if (!sessionId) {
            sessionId = uuidv4();
            res.cookie("session_id", sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            });
        }

        req.session_id = sessionId;
        next();
    } catch (error) {
        console.error("Error in guestSessionMiddleware:", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
