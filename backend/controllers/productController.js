// const Product = require("../models/Product.js");

// // @desc    Fetch all products
// // @route   GET /api/products
// // @access  Public
// const getProducts = async (req, res) => {
//   const products = await Product.find({});
//   res.json(products);
// };

// // @desc    Fetch single product
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// };

// // @desc    Create a product
// // @route   POST /api/products
// // @access  Private/Admin
// const createProduct = async (req, res) => {
//   const { name, description, category, sizes, featured } = req.body;

//   const product = new Product({
//     name,
//     description,
//     category,
//     sizes,
//     featured,
//     images: req.files.map(file => file.path),
//     admin: req.admin._id,
//   });

//   const createdProduct = await product.save();
//   res.status(201).json(createdProduct);
// };

// // @desc    Update a product
// // @route   PUT /api/products/:id
// // @access  Private/Admin
// const updateProduct = async (req, res) => {
//   const { name, description, category, sizes, featured } = req.body;

//   const product = await Product.findById(req.params.id);

//   if (product) {
//     product.name = name;
//     product.description = description;
//     product.category = category;
//     product.sizes = sizes;
//     product.featured = featured;

//     if (req.files && req.files.length > 0) {
//       product.images = req.files.map(file => file.path);
//     }

//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// };

// // @desc    Delete a product
// // @route   DELETE /api/products/:id
// // @access  Private/Admin
// const deleteProduct = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     await product.remove();
//     res.json({ message: "Product removed" });
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };


// ProductController.js





const Product = require("../models/Product.js");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, category, featured } = req.body;
  let sizes;
  try {
    sizes = JSON.parse(req.body.sizes);
  } catch (error) {
    return res.status(400).json({ message: "Invalid sizes format" });
  }

  const images = req.files ? req.files.map((file) => file.path) : [];

  const product = new Product({
    name,
    description,
    category,
    sizes,
    featured,
    images,
    admin: req.admin._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, category, featured } = req.body;
  let sizes;
  if (req.body.sizes) {
    try {
      sizes = JSON.parse(req.body.sizes);
    } catch (error) {
      return res.status(400).json({ message: "Invalid sizes format" });
    }
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    if (sizes) {
      product.sizes = sizes;
    }

    if (req.body.featured !== undefined) {
      product.featured = featured;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    } else if (req.body.images) {
      try {
        product.images = JSON.parse(req.body.images);
      } catch (error) {
        // Do nothing if images are not valid JSON
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // In a real app, you might want to delete images from Cloudinary here
    await product.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};