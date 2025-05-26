import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const courseRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  pin: {
    type: String,
    default: null,
  },
  pinExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userInfo: {
    name: { type: String, required: true },
    institute: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    additionalInfo: { type: String },
  },
});

courseRequestSchema.methods.generatePin = function () {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  this.pin = pin;
  // Pin expires in 7 days
  this.pinExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return pin;
};

export const Course = mongoose.model("Course", courseSchema);
export const CourseRequest = mongoose.model(
  "CourseRequest",
  courseRequestSchema
);
