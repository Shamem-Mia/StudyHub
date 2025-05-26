import express from "express";
import {
  getAllCourses,
  getAdminCourses,
  createCourse,
  deleteCourse,
  requestCourse,
  getUserRequests,
  getAdminRequests,
  processRequest,
} from "../controllers/courseController.js";
import authUser from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const courseRouter = express.Router();

// Public routes
courseRouter.get("/", getAllCourses);

// User protected routes
courseRouter.post("/request/:courseId", authUser, requestCourse);
courseRouter.get("/requests", authUser, getUserRequests);

// Admin protected routes
courseRouter.get("/admin", authUser, isAdmin, getAdminCourses);
courseRouter.post("/", authUser, isAdmin, createCourse);
courseRouter.delete("/:id", authUser, isAdmin, deleteCourse);
courseRouter.get("/admin/requests", authUser, isAdmin, getAdminRequests);
courseRouter.put(
  "/admin/requests/:requestId",
  authUser,
  isAdmin,
  processRequest
);

export default courseRouter;
