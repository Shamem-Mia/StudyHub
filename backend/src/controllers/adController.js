import Ad from "../models/AdModel.js";

export const getActiveAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createAd = async (req, res) => {
  try {
    const { scriptContent, type, link } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Ad type is required",
      });
    }

    if (type === "script" && !scriptContent) {
      return res.status(400).json({
        success: false,
        message: "Script content is required for script ads",
      });
    }

    if (type === "image" && !link) {
      return res.status(400).json({
        success: false,
        message: "Link is required for image ads",
      });
    }

    const newAd = new Ad({
      type,
      scriptContent: type === "script" ? scriptContent : undefined,
      link: type === "image" ? link : undefined,
      isActive: true,
    });

    await newAd.save();

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      ad: newAd,
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const ad = await Ad.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement status updated",
      ad,
    });
  } catch (error) {
    console.error("Error updating ad status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findByIdAndDelete(id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
