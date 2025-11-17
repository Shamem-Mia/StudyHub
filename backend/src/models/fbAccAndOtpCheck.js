// models/FacebookResult.js
import mongoose from "mongoose";

const facebookResultSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountExists: {
      type: Boolean,
      required: true,
    },
    otpSent: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "account_found_otp_sent",
        "account_found_otp_not_sent",
        "no_account",
      ],
      default: "no_account",
    },
    finalUrl: {
      type: String,
      trim: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    processedOrder: {
      type: Number,
      required: true,
      default: 0,
    },
    totalNumbersInBatch: {
      type: Number,
      required: true,
      default: 0,
    },
    batchId: {
      type: String,
      trim: true,
    },
    processingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Indexes
facebookResultSchema.index({ phoneNumber: 1 });
facebookResultSchema.index({ status: 1 });
facebookResultSchema.index({ createdAt: -1 });
facebookResultSchema.index({ batchId: 1 });
facebookResultSchema.index({ processedOrder: 1 });

const FacebookResult = mongoose.model("FacebookResult", facebookResultSchema);

export default FacebookResult;
