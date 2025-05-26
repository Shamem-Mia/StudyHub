import PDF from "../models/uploadModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getNotes = async (req, res) => {
  try {
    // Get all PDFs with category 'note'
    const notes = await PDF.find({
      category: "note",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        notes,
      },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSlides = async (req, res) => {
  try {
    // Get all PDFs with category 'slide'
    const slides = await PDF.find({
      category: "slide",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        slides,
      },
    });
  } catch (error) {
    console.error("Error fetching slides:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getChowtha = async (req, res) => {
  try {
    // Get all PDFs with category 'chowtha'
    const chowthas = await PDF.find({
      category: "chowtha",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        chowthas,
      },
    });
  } catch (error) {
    console.error("Error fetching chowthas:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getLabReport = async (req, res) => {
  try {
    // Get all PDFs with category 'lab_report'
    const labReports = await PDF.find({
      category: "lab_report",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        labReports,
      },
    });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getBook = async (req, res) => {
  try {
    // Get all PDFs with category 'book'
    const books = await PDF.find({
      category: "book",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        books,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getPrevQuestion = async (req, res) => {
  try {
    // Get all PDFs with category 'prev_question'
    const questions = await PDF.find({
      category: "prev_question",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        questions,
      },
    });
  } catch (error) {
    console.error("Error fetching previous questions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getRandomPdfs = async (req, res) => {
  try {
    const randomPdfs = await PDF.aggregate([{ $sample: { size: 20 } }]);

    res.status(200).json({
      success: true,
      data: {
        pdfs: randomPdfs,
      },
    });
  } catch (error) {
    console.error("Error fetching random PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const likePdf = async (req, res) => {
  try {
    const { noteId } = req.params;

    let ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress;
    if (ip.includes(",")) {
      ip = ip.split(",")[0];
    }
    ip = ip.trim();
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "localhost";
    }

    const note = await PDF.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (!note.likedIPs) {
      note.likedIPs = [];
    }

    if (note.likedIPs.includes(ip)) {
      return res.status(400).json({
        success: false,
        message: "You already liked this note",
      });
    }

    // Add like
    note.likes += 1;
    note.likedIPs.push(ip);
    await note.save();

    res.status(200).json({
      success: true,
      data: {
        likes: note.likes,
      },
    });
  } catch (error) {
    console.error("Error liking note:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// For admin

export const getPdfForAmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { courseName: { $regex: search, $options: "i" } },
        { instituteName: { $regex: search, $options: "i" } },
      ];
    }

    const [pdfs, total] = await Promise.all([
      PDF.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PDF.countDocuments(query),
    ]);

    res.json({
      pdfs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserForAdmin = async (req, res) => {
  try {
    const users = await User.find({}, "name email createdAt");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePdfByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPdf = await PDF.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePdfByAdmin = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) return res.status(404).json({ error: "PDF not found" });

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(pdf.public_id, {
        resource_type: "raw",
      });
    } catch (cloudErr) {
      console.error("Cloudinary deletion failed:", cloudErr);
    }

    // Delete from database
    await PDF.findByIdAndDelete(req.params.id);

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserAndPdfsByAdmin = async (req, res) => {
  try {
    // First find all PDFs by this user
    const userPdfs = await PDF.find({ userId: req.params.id });

    // Delete all PDFs from Cloudinary
    await Promise.all(
      userPdfs.map((pdf) =>
        cloudinary.uploader.destroy(pdf.public_id, { resource_type: "raw" })
      )
    );

    // Delete all PDFs from database
    await PDF.deleteMany({ userId: req.params.id });

    // Finally delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and all their PDFs deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
