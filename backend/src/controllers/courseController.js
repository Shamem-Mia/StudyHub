import { Course, CourseRequest } from "../models/courseModel.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

export const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { courses } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, duration } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      duration,
    });

    await course.save();
    res.status(201).json({ success: true, data: { course } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    await Course.findByIdAndDelete(req.params.id);
    await CourseRequest.deleteMany({ course: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

export const requestCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const { userInfo } = req.body;

    // Validate required fields
    if (
      !userInfo ||
      !userInfo.name ||
      !userInfo.institute ||
      !userInfo.address ||
      !userInfo.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required user information",
      });
    }

    // Check for existing request
    // const existingRequest = await CourseRequest.findOne({
    //   user: req.user._id,
    //   course: req.params.courseId,
    // });

    // if (existingRequest) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already requested this course",
    //   });
    // }

    // Create new request with user info
    const request = new CourseRequest({
      user: req.user._id,
      course: req.params.courseId,
      userInfo: {
        name: userInfo.name,
        institute: userInfo.institute,
        address: userInfo.address,
        phone: userInfo.phone,
        additionalInfo: userInfo.additionalInfo || "",
      },
    });

    await request.save();
    await request.populate("user", "name email");
    await request.populate("course", "title price");

    res.status(201).json({ success: true, data: { request } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to request course",
      error: error.message,
    });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const requests = await CourseRequest.find({ user: req.user._id })
      .populate("course", "title price pin")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { requests } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

export const getAdminRequests = async (req, res) => {
  try {
    const requests = await CourseRequest.find()
      .populate("user", "name email")
      .populate("course", "title price userInfo")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { requests } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

export const processRequest = async (req, res) => {
  try {
    const request = await CourseRequest.findById(req.params.requestId)
      .populate("user", "name email")
      .populate("course", "title price");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    const { action } = req.body;

    if (action === "approve") {
      request.status = "approved";
      request.generatePin();
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    await request.save();
    res.status(200).json({ success: true, data: { request } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
};
