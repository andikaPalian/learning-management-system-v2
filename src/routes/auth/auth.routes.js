import express from "express";
import { loginUser, logoutUser, registerUser } from "../../controllers/auth/auth.controller.js";
import { auth } from "../../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", auth, logoutUser);

export default authRouter;