import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import "dotenv/config";
import { connectCloudinary } from "./src/utils/cloudinary.js";
import authRouter from "./src/routes/auth/auth.routes.js";
import userRouter from "./src/routes/user/user.routes.js";

const app = express();
const port = process.env.PORT;
connectCloudinary();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Handle multer errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        console.error("Unexpected error:", err)
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
    next();
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});