import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "note",
        "slide",
        "chowtha",
        "lab_report",
        "prev_question",
        "book",
        "other",
      ],
      default: "note",
    },
    courseName: {
      type: String,
      required: true,
    },
    instituteName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedIPs: [
      {
        type: String,
        default: [],
        select: false,
      },
    ],
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
