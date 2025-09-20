const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    username,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = (req, res) => {
  // In a real-world scenario with session-based authentication,
  // you would invalidate the session here.
  // For JWT, the client is responsible for clearing the token.
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { loginAdmin, registerAdmin, logoutAdmin };
