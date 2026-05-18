const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const controller = require("../config/controller");

const getAllUsers = controller(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({
    success: true,
    data: users
  });
});

const getUserById = controller(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json({
    success: true,
    data: user
  });
});

const updateUser = controller(async (req, res) => {
  const { name, email, role, password } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (password !== undefined) user.password = password;

  await user.save();

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const deleteUser = controller(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    message: "User deleted"
  });
});

const getUsersByRole = controller(async (req, res) => {
  const { role } = req.params;
  const users = await User.find({ role }).select("-password");

  res.json({
    success: true,
    data: users
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
};