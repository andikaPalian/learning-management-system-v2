import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectCloudinary } from "./src/utils/cloudinary.js";
import authRouter from "./src/routes/auth/auth.routes.js";
import userRouter from "./src/routes/user/user.routes.js";
import courseRouter from "./src/routes/course/course.routes.js";
import categoryRouter from "./src/routes/course/category.routes.js";
import moduleRouter from "./src/routes/course/module.routes.js";
import contentRouter from "./src/routes/course/content.routes.js";
import quizRouter from "./src/routes/course/quiz.routes.js";
import questionRouter from "./src/routes/course/question.routes.js";

const app = express();
const port = process.env.PORT;
connectCloudinary();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/category", categoryRouter);
app.use("/api/module", moduleRouter);
app.use("/api/content", contentRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/question", questionRouter);

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