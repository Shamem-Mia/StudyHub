// routes/adRoutes.js
import express from "express";
import {
  getActiveAds,
  createAd,
  updateAdStatus,
  deleteAd,
} from "../controllers/adController.js";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const adRouter = express.Router();

// Public route - get active ads
adRouter.get("/", getActiveAds);

// Admin routes
adRouter.post("/", authUser, isAdmin, createAd);
adRouter.put("/:id/status", authUser, isAdmin, updateAdStatus);
adRouter.delete("/:id", authUser, isAdmin, deleteAd);

export default adRouter;
