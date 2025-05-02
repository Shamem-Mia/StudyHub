import MarqueeMessage from "../models/MarqueeMessage.js";

// Get active marquee message
export const getActiveMarqueeMessage = async (req, res) => {
  try {
    const message = await MarqueeMessage.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!message) {
      return res.status(200).json({
        message: "Welcome to StudyHub!",
      });
    }

    res.status(200).json({
      message: message.message,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch marquee message" });
  }
};

// Create new marquee message (Admin only)
export const createMarqueeMessage = async (req, res) => {
  try {
    // First deactivate all previous messages
    await MarqueeMessage.updateMany({}, { isActive: false });

    const newMessage = new MarqueeMessage({
      message: req.body.message,
      isActive: true,
    });

    await newMessage.save();

    res.status(201).json({
      message: "Marquee message created successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create marquee message" });
  }
};

// Get all marquee messages (Admin only)
export const getAllMarqueeMessages = async (req, res) => {
  try {
    const messages = await MarqueeMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch marquee messages" });
  }
};

// Update marquee message (Admin only)
export const updateMarqueeMessage = async (req, res) => {
  try {
    const message = await MarqueeMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (req.body.isActive) {
      // If activating this message, deactivate all others
      await MarqueeMessage.updateMany(
        { _id: { $ne: message._id } },
        { isActive: false }
      );
    }

    message.message = req.body.message || message.message;
    message.isActive =
      req.body.isActive !== undefined ? req.body.isActive : message.isActive;
    message.updatedAt = Date.now();

    await message.save();

    res.status(200).json({
      message: "Marquee message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update marquee message" });
  }
};

// Delete marquee message (Admin only)
export const deleteMarqueeMessage = async (req, res) => {
  try {
    const message = await MarqueeMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({
      message: "Marquee message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete marquee message" });
  }
};
