import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["script", "image"],
    },
    scriptContent: {
      type: String,
      required: function () {
        return this.type === "script";
      },
    },
    link: {
      type: String,
      required: function () {
        return this.type === "image";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Ad = mongoose.model("Ad", adSchema);

export default Ad;
