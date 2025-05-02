import express from "express";
import {
  uploadPDF,
  getPDFs,
  deletePDF,
} from "../controllers/uploadController.js";
import authUser from "../middlewares/userAuth.js";

const uploadRouter = express.Router();

// Upload PDF
uploadRouter.post("/upload", authUser, uploadPDF);

// Get all PDFs
uploadRouter.get("/pdfs", authUser, getPDFs);

// Delete PDF
uploadRouter.delete("/pdfs/:id", authUser, deletePDF);

export default uploadRouter;
