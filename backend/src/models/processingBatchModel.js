// models/ProcessingBatch.js
import mongoose from "mongoose";

const processingBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    totalNumbers: {
      type: Number,
      required: true,
    },
    numbersProcessed: {
      type: Number,
      default: 0,
    },
    accountsFound: {
      type: Number,
      default: 0,
    },
    otpsSent: {
      type: Number,
      default: 0,
    },
    accountsFoundButNoOtp: {
      type: Number,
      default: 0,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed", "stopped"],
      default: "processing",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    processingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Indexes
processingBatchSchema.index({ batchId: 1 });
processingBatchSchema.index({ status: 1 });
processingBatchSchema.index({ createdAt: -1 });

const ProcessingBatch = mongoose.model(
  "ProcessingBatch",
  processingBatchSchema
);

export default ProcessingBatch;
