import express from "express";
import { loginUser, registerUser } from "../../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;