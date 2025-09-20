// const express = require("express");
// const router = express.Router();
// const {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController.js");
// const { protect } = require("../middleware/authMiddleware.js");
// const upload = require("../middleware/uploadMiddleware.js");

// router.route("/").get(getProducts).post(protect, upload.array("images"), createProduct);
// router
//   .route("/:id")
//   .get(getProductById)
//   .put(protect, upload.array("images"), updateProduct)
//   .delete(protect, deleteProduct);

// module.exports = router;



// productRoutes.js

const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");

// The upload middleware has been removed from the POST and PUT routes
router.route("/").get(getProducts).post(protect, upload.array('images'), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, upload.array('images'), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;