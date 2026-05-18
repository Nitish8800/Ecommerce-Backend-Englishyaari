const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const controller = require("../config/controller");

const createProduct = controller(async (req, res) => {
  const { name, category, price } = req.body;
  const product = await Product.create({ name, category, price });

  res.status(201).json({
    success: true,
    data: product
  });
});

const getAllProducts = controller(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    data: products
  });
});

const getProductById = controller(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({
    success: true,
    data: product
  });
});

const updateProduct = controller(async (req, res) => {
  const { name, category, price } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, category, price },
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({
    success: true,
    data: product
  });
});

const deleteProduct = controller(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({
    success: true,
    message: "Product deleted"
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};