const jwt = require("jsonwebtoken");
const User = require("../models/User");
const controller = require("../config/controller");

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

const register = controller(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password, role });
  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    message: "User created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = controller(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const getCurrentUser = controller(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});

module.exports = {
  register,
  login,
  getCurrentUser
};