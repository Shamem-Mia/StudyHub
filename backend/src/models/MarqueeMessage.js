import mongoose from "mongoose";

const marqueeMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MarqueeMessage = mongoose.model("MarqueeMessage", marqueeMessageSchema);

export default MarqueeMessage;
