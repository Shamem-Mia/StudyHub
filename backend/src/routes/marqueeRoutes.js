import express from "express";
import {
  getActiveMarqueeMessage,
  createMarqueeMessage,
  getAllMarqueeMessages,
  updateMarqueeMessage,
  deleteMarqueeMessage,
} from "../controllers/marqueeController.js";
import isAdmin from "../middlewares/isAdmin.js";
import authUser from "../middlewares/userAuth.js";

const messageRouter = express.Router();

// Public route
messageRouter.get("/active", getActiveMarqueeMessage);

// Admin routes
messageRouter.post("/", authUser, isAdmin, createMarqueeMessage);
messageRouter.get("/", authUser, isAdmin, getAllMarqueeMessages);
messageRouter.put("/:id", authUser, isAdmin, updateMarqueeMessage);
messageRouter.delete("/:id", authUser, isAdmin, deleteMarqueeMessage);

export default messageRouter;
