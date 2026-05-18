const Order = require("../models/Order");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const controller = require("../config/controller");

async function calculateTotalAmount(productsInput) {
  const productIds = productsInput.map((p) => p.productId);
  const dbProducts = await Product.find({ _id: { $in: productIds } });

  const priceMap = new Map();
  dbProducts.forEach((p) => {
    priceMap.set(String(p._id), p.price);
  });

  let total = 0;
  for (const item of productsInput) {
    const price = priceMap.get(String(item.productId));
    if (!price) {
      throw new ApiError(400, `Invalid productId: ${item.productId}`);
    }
    total += price * item.quantity;
  }
  return total;
}

const createOrder = controller(async (req, res) => {
  const { products, status } = req.body;

  const totalAmount = await calculateTotalAmount(products);

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalAmount,
    status: status || "completed"
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

const getMyOrders = controller(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("products.productId")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
});

const getAllOrders = controller(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email role")
    .populate("products.productId")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
});

const getMonthlyRevenue = controller(async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        revenue: { $sum: "$totalAmount" }
      }
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lte: ["$_id.month", 9] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]
            }
          ]
        },
        revenue: 1
      }
    },
    { $sort: { month: 1 } }
  ];

  const result = await Order.aggregate(pipeline);

  res.json({
    success: true,
    data: result
  });
});

const getUserStats = controller(async (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $group: {
        _id: "$userId",
        userName: { $first: "$user.name" },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" }
      }
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        userName: 1,
        totalOrders: 1,
        totalSpent: 1
      }
    },
    { $sort: { totalSpent: -1 } }
  ];

  const result = await Order.aggregate(pipeline);

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getMonthlyRevenue,
  getUserStats
};