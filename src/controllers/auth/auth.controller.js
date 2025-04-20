import { register, login, logout } from "../../services/auth/auth.service.js";
import { AppError } from "../../utils/errorHandler.js";

export const registerUser = async (req, res, next) => {
    try {
        const {firstName, lastName, username, gender, email, password} = req.body;

        const user = await register({firstName, lastName, username, gender, email, password});

        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        next(error);
    };
};

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const {accessToken, refreshToken, user} = await login({email, password});

        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'Strict',
        });
        
        return res.status(200).json({
            message: "User logged in successfully",
            accessToken,
            user
        });
    } catch (error) {
        next(error);
    };
};

export const logoutUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        await logout(userId);

        // Clear cached token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        next(error);
    }
}