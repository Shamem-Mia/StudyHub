import express from "express";
import authUser from "../middlewares/userAuth.js";
import { getUserData, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/user-data", authUser, getUserData);
userRouter.put("/edit-profile", authUser, updateProfile);

export default userRouter;
