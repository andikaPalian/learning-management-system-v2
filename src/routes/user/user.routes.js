import express from "express";
import { auth } from "../../middlewares/auth.js";
import { editUserProfile, getUserProfile } from "../../controllers/user/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", auth, getUserProfile);
userRouter.patch("/edit-profile", auth, editUserProfile);

export default userRouter;