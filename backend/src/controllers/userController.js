import authUser from "../middlewares/userAuth.js";
import User from "../models/userModel.js";

export const getUserData = async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, dateOfBirth, instituteName } = req.body;

    const userId = req.user._id;

    // Validate input
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    // Prepare update data
    const updateData = {
      fullName,
      phone: phone || "",
      address: address || "",
      instituteName: instituteName || "",
    };

    // Only update dateOfBirth if provided and valid
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (!isNaN(dob.getTime())) {
        updateData.dateOfBirth = dob;
      }
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -verifyOtp -resetOtp");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
