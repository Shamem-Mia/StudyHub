import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import PDF from "../models/uploadModel.js";
import { Readable } from "stream";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
}).single("pdf");

// Upload PDF
export const uploadPDF = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size exceeds 10MB limit",
          });
        }
        if (err.message === "Only PDF files are allowed!") {
          return res.status(400).json({
            success: false,
            message: "Only PDF files are allowed",
          });
        }
        return res.status(400).json({
          success: false,
          message: "File upload failed",
          error: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Validate category
      const validCategories = [
        "note",
        "slide",
        "chowtha",
        "lab_report",
        "prev_question",
        "book",
        "other",
      ];
      if (!validCategories.includes(req.body.category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "pdf-uploads",
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        if (!req.user._id) {
          return res.status(400).json({
            success: false,
            message: "User is not valid!",
          });
        }

        // Convert buffer to stream
        const stream = Readable.from(req.file.buffer);
        stream.pipe(uploadStream);
      });

      const newPDF = new PDF({
        title: req.body.title || req.file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
        size: req.file.size,
        category: req.body.category,
        courseName: req.body.courseName,
        instituteName: req.body.instituteName,
        userId: new mongoose.Types.ObjectId(req.user._id),
      });

      await newPDF.save();

      res.status(201).json({
        success: true,
        message: "PDF uploaded successfully",
        data: newPDF,
      });
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all PDFs
export const getPDFs = async (req, res) => {
  try {
    const existingUserId = req.user._id;
    if (!existingUserId) {
      return res.status(400).json({
        success: false,
        message: "User id not Found!",
      });
    }
    const pdfs = await PDF.find({ userId: existingUserId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: pdfs,
    });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete PDF
export const deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(pdf.public_id, {
      resource_type: "raw",
    });

    // Delete from database
    await PDF.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
