import { register, login } from "../../services/auth/auth.service.js";

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

        const user = await login({email, password});
        
        return res.status(200).json({
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        next(error);
    };
};