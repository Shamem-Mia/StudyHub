import express from "express";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/websiteController.js";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const websiteRouter = express.Router();

// Public routes
websiteRouter.get("/templates", getTemplates);

// Protected user routes
websiteRouter.post("/templates/orders", authUser, createOrder);
websiteRouter.get("/orders", authUser, getUserOrders);

// Admin routes
websiteRouter.post("/templates", authUser, isAdmin, createTemplate);
websiteRouter.put("/templates/:id", authUser, isAdmin, updateTemplate);
websiteRouter.delete("/templates/:id", authUser, isAdmin, deleteTemplate);
websiteRouter.get("/admin/orders", authUser, isAdmin, getAllOrders);
websiteRouter.put("/admin/orders/:id", authUser, isAdmin, updateOrderStatus);

export default websiteRouter;
