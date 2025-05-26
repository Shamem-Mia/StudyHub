import { WebsiteTemplate, WebsiteOrder } from "../models/websiteModel.js";

// Get all website templates
export const getTemplates = async (req, res) => {
  try {
    const templates = await WebsiteTemplate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
};

// Create new template (admin only)
export const createTemplate = async (req, res) => {
  try {
    const { title, description, features, price, contact, category } = req.body;

    const template = new WebsiteTemplate({
      title,
      description,
      features,
      price,
      contact,
      category,
    });

    await template.save();
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create template",
      error: error.message,
    });
  }
};

// Update template (admin only)
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, features, price, contact, category } = req.body;

    const template = await WebsiteTemplate.findByIdAndUpdate(
      id,
      { title, description, features, price, contact, category },
      { new: true }
    );

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update template",
      error: error.message,
    });
  }
};

// Delete template (admin only)
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await WebsiteTemplate.findByIdAndDelete(id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    // Also delete associated orders
    await WebsiteOrder.deleteMany({ templateId: id });

    res
      .status(200)
      .json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customerInfo, templateId } = req.body;

    // Validate required fields
    if (
      !customerInfo ||
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.business
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required customer information",
      });
    }

    // Check if template exists
    const template = await WebsiteTemplate.findById(templateId);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    // Check if user already has a pending order for this template
    const existingOrder = await WebsiteOrder.findOne({
      "customerInfo.email": customerInfo.email,
      templateId,
      status: "pending",
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending order for this template",
      });
    }

    const order = new WebsiteOrder({
      templateId,
      title: template.title,
      price: template.price,
      customerInfo,
    });

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const { email } = req.user;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const orders = await WebsiteOrder.find({
      "customerInfo.email": email,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await WebsiteOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"',
      });
    }

    const order = await WebsiteOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};
