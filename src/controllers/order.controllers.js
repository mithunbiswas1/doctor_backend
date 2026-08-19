// src/controllers/order.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { Item } from "../models/item.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Transform order data for consistent response
const transformOrderData = (order) => {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    customer: order.customer,
    deliveryAddress: order.deliveryAddress,
    items: order.items,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderType: order.orderType,
    createdBy: order.createdBy,
    updatedBy: order.updatedBy,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

// ==================== CREATE ORDER ====================
const createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    deliveryAddress,
    items,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    paymentMethod = "cash",
    orderType = "cart",
  } = req.body;

  let userId = req.user?._id;
  let isNewUser = false;
  let userPassword = null;

  // Validation
  if (!customer) {
    throw new ApiError(400, "Customer information is required");
  }

  if (!customer.firstName) {
    throw new ApiError(400, "First name is required");
  }

  if (!customer.email) {
    throw new ApiError(400, "Email is required");
  }

  if (!customer.phone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!deliveryAddress) {
    throw new ApiError(400, "Delivery address is required");
  }

  if (!deliveryAddress.addressLine1) {
    throw new ApiError(400, "Address line 1 is required");
  }

  if (!deliveryAddress.zipCode) {
    throw new ApiError(400, "ZIP code is required");
  }

  if (!items || items.length === 0) {
    throw new ApiError(400, "At least one item is required");
  }

  // Validate items exist
  const productIds = items.map((item) => item.productId);
  const existingItems = await Item.find({ _id: { $in: productIds } });

  if (existingItems.length !== productIds.length) {
    throw new ApiError(404, "Some items not found");
  }

  // Check if user exists, if not create one
  if (!userId) {
    // Check if user exists by email or phone
    let existingUser = await User.findOne({
      $or: [
        { email: customer.email.trim().toLowerCase() },
        { phone: customer.phone.trim() },
      ],
    });

    if (existingUser) {
      userId = existingUser._id;
    } else {
      // Create new user
      const defaultPassword = "12345678";
      userPassword = defaultPassword;

      // Generate username from firstName or email
      let baseUsername = customer.firstName
        .trim()
        .toLowerCase()
        .replace(/\s/g, "");
      let username = baseUsername;
      let counter = 1;

      // Check if username exists, if so add number
      while (await User.findOne({ userName: username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const newUser = await User.create({
        userName: username,
        fullName: customer.firstName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        password: defaultPassword,
        role: "customer",
        is_active: true,
      });

      userId = newUser._id;
      isNewUser = true;
    }
  }

  // Calculate totals from items to ensure consistency
  let calculatedSubtotal = 0;
  let calculatedDiscount = 0;

  for (const item of items) {
    const price = item.discountedPrice || item.price;
    calculatedSubtotal += price * item.quantity;
    if (item.discountedPrice && item.discountedPrice < item.price) {
      calculatedDiscount += (item.price - item.discountedPrice) * item.quantity;
    }
  }

  const calculatedTotal = calculatedSubtotal + (deliveryFee || 0);

  // Create order
  const order = await Order.create({
    customer: {
      firstName: customer.firstName.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
    },
    deliveryAddress: {
      addressLine1: deliveryAddress.addressLine1.trim(),
      addressLine2: deliveryAddress.addressLine2
        ? deliveryAddress.addressLine2.trim()
        : "",
      zipCode: deliveryAddress.zipCode.trim(),
      deliveryInstructions: deliveryAddress.deliveryInstructions || "",
    },
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      discountedPrice: item.discountedPrice || null,
      variationName: item.variationName || null,
      quantity: item.quantity,
    })),
    subtotal: calculatedSubtotal,
    discountAmount: calculatedDiscount,
    deliveryFee: deliveryFee || 0,
    total: calculatedTotal,
    paymentMethod: paymentMethod,
    orderType: orderType || "cart",
    createdBy: userId,
    updatedBy: userId,
  });

  const populatedOrder = await Order.findById(order._id)
    .populate("createdBy updatedBy", "userName fullName email phone")
    .lean();

  const transformedOrder = transformOrderData(populatedOrder);

  // Prepare response
  const responseData = {
    order: transformedOrder,
  };

  // If new user was created, include credentials in response
  if (isNewUser) {
    responseData.account = {
      isNewUser: true,
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
      password: userPassword,
      message:
        "A new account has been created for you. You can login with your phone number/email and the default password.",
    };
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        responseData,
        isNewUser
          ? "Order placed successfully! A new account has been created for you."
          : "Order created successfully"
      )
    );
});

// ==================== GET ALL ORDERS ====================
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    orderType,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate,
  } = req.query;

  const query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by order type
  if (orderType) {
    query.orderType = orderType;
  }

  // Date filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
    }
  }

  // Search by order number, customer name, email, or phone
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "customer.firstName": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate("createdBy updatedBy", "userName fullName email phone")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  const totalCount = await Order.countDocuments(query);

  const transformedOrders = orders.map(transformOrderData);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders: transformedOrders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit: parseInt(limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Orders fetched successfully"
    )
  );
});

// ==================== GET ORDER BY ID ====================
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  const order = await Order.findById(id)
    .populate("createdBy updatedBy", "userName fullName email phone")
    .populate("items.productId", "name slug image")
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const transformedOrder = transformOrderData(order);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedOrder, "Order fetched successfully"));
});

// ==================== GET ORDER BY ORDER NUMBER ====================
const getOrderByNumber = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;

  if (!orderNumber) {
    throw new ApiError(400, "Order number is required");
  }

  const order = await Order.findOne({ orderNumber })
    .populate("createdBy updatedBy", "userName fullName email phone")
    .populate("items.productId", "name slug image")
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const transformedOrder = transformOrderData(order);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedOrder, "Order fetched successfully"));
});

// ==================== GET ORDERS BY USER ====================
const getOrdersByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = { createdBy: userId };

  if (status) {
    query.status = status;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .populate("createdBy updatedBy", "userName fullName email phone")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  const totalCount = await Order.countDocuments(query);

  const transformedOrders = orders.map(transformOrderData);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders: transformedOrders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit: parseInt(limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Orders fetched successfully"
    )
  );
});

// ==================== UPDATE ORDER STATUS ====================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // If order is already delivered or cancelled, don't allow status change
  if (order.status === "delivered" || order.status === "cancelled") {
    throw new ApiError(400, `Cannot update status of ${order.status} order`);
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("createdBy updatedBy", "userName fullName email phone")
    .lean();

  const transformedOrder = transformOrderData(updatedOrder);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedOrder,
        `Order status updated to ${status} successfully`
      )
    );
});

// ==================== UPDATE PAYMENT STATUS ====================
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  if (!paymentStatus) {
    throw new ApiError(400, "Payment status is required");
  }

  const validStatuses = ["pending", "paid", "failed"];
  if (!validStatuses.includes(paymentStatus)) {
    throw new ApiError(
      400,
      `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      paymentStatus,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("createdBy updatedBy", "userName fullName email phone")
    .lean();

  const transformedOrder = transformOrderData(updatedOrder);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedOrder,
        `Payment status updated to ${paymentStatus} successfully`
      )
    );
});

// ==================== CANCEL ORDER ====================
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Don't allow cancellation of delivered orders
  if (order.status === "delivered") {
    throw new ApiError(400, "Cannot cancel a delivered order");
  }

  // If already cancelled
  if (order.status === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: "cancelled",
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("createdBy updatedBy", "userName fullName email phone")
    .lean();

  const transformedOrder = transformOrderData(updatedOrder);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedOrder, "Order cancelled successfully")
    );
});

// ==================== DELETE ORDER ====================
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  await Order.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});

export {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getOrdersByUser,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
};
