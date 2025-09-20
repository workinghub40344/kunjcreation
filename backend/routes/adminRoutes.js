const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
} = require("../controllers/adminController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", protect, logoutAdmin);

module.exports = router;
