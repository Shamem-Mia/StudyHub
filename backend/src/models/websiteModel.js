import mongoose from "mongoose";

const websiteTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const websiteOrderSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebsiteTemplate",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      business: {
        type: String,
        required: true,
      },
      requirements: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    pin: {
      type: String,
    },
  },
  { timestamps: true }
);

// Generate a random 4-digit PIN before saving an approved order
websiteOrderSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "approved" && !this.pin) {
    this.pin = Math.floor(1000 + Math.random() * 9000).toString();
  }
  next();
});

export const WebsiteTemplate = mongoose.model(
  "WebsiteTemplate",
  websiteTemplateSchema
);
export const WebsiteOrder = mongoose.model("WebsiteOrder", websiteOrderSchema);
