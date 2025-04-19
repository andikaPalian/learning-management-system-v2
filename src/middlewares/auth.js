import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        // Pastikan header Authorization ada dan diawali format "Bearer <token>"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                message: "Token is missing or not provided"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verifikasi token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message: error.name === "TokenExpiredError" ? "Unauthorized: Token has expired" : "Unauthorized: Invalid token"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = {
            userId: user.id,
            username: user.username,
            role: user.role,
            email: user.email
        };

        next();
    } catch (error) {
        console.error("Error during authentication: ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error occurred"
        });
    }
}

export const hasRole = (roles) => {
    return (req, res, next) => {
        try {
            // Validasi parameter input
            if (!Array.isArray(roles) || roles.length === 0) {
                return res.status(500).json({
                    message: "Internal server error: Role parameter is missing or invalid"
                });
            }
            
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized: Please login first"
                });
            }

            // Periksa apakah req.user.role ada
            if (!req.user.role) {
                return res.status(403).json({
                    message: "Forbidden: Role is missing in user object"
                });
            }

            // Periksa apakah req.user.role adalah array
            const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
            // Periksa apakah user memiliki setidaknya satu role yang diizinkan
            const allowedRoles = userRoles.some(role => roles.includes(role));
            if (!allowedRoles) {
                return res.status(403).json({
                    message: `Forbidden: Required roles : ${roles.join(", ")}`
                });
            }

            next();
        } catch (error) {
            console.error("Error during role validation: ", error);
            return res.status(500).json({
                message: "Internal server error",
                error: error.message || "An unexpected error occurred"
            });
        }
    }
}