// routes/fbOtpRoutes.js
import express from "express";
import { fbAutomatOtpController } from "../controllers/fbAutomatOtpController.js";

const fbOtpRouter = express.Router();

// Facebook OTP automation route
fbOtpRouter.post("/", fbAutomatOtpController);

export default fbOtpRouter;
