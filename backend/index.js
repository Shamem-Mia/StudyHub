import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/dbConnection.js";
import router from "./src/routes/authRoute.js";
import userRouter from "./src/routes/userRoute.js";
import uploadRouter from "./src/routes/uploadRouter.js";
import pdfRouter from "./src/routes/pdfRoute.js";
import adRouter from "./src/routes/adRoutes.js";
import messageRouter from "./src/routes/marqueeRoutes.js";
import path from "path";
import courseRouter from "./src/routes/courseRouter.js";
import websiteRouter from "./src/routes/websiteRoutes.js";
import fbOtpRouter from "./src/routes/fbAutomatOtpRouter.js";

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// api end point
app.use("/api/auth", router);
app.use("/api/users", userRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/pdfs", pdfRouter);
app.use("/api/ads", adRouter);
app.use("/api/marquee", messageRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sels", websiteRouter);
app.use("/api/facebook-reset-check", fbOtpRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on PORT ${port} `);
});
