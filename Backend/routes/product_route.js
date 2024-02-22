// routes/product_route.js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product_model");

// Configure Multer for file upload
const multer = require("multer");
const upload = multer();

// Route to handle counting products by admin email to show in admin page
router.get("/adminPage/count", async (req, res) => {
  try {
    const { adminEmail } = req.query;
    // Count the number of products associated with the admin's email
    const count = await Product.countDocuments({ adminEmail });
    console.log("product route reached");
    res.json({ count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", upload.single("productImage"), async (req, res) => {
  try {
    // Extract product data from the request body
    const {
      adminEmail,
      supervisorEmail,
      productId,
      productName,
      productCategory,
      productDescription,
      price,
    } = req.body;

    // Extract the file data from the request object
    const productImage = req.file.buffer; // Buffer containing the image data

    // Convert image to base64
    const base64Image = productImage.toString("base64");

    // Create a new product instance
    const newProduct = new Product({
      adminEmail,
      supervisorEmail,
      productId,
      productName,
      productImage: base64Image, // Save the base64 encoded image data
      productCategory,
      productDescription,
      price,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message }); // Return the error message to the client
  }
});

// Route to fetch count of products associated with a supervisor's email to show in supervisor page
router.get("/supervisorPage/count", async (req, res) => {
  const { supervisorEmail } = req.query;

  try {
    // Find all products that match the supervisor's email
    const productCount = await Product.countDocuments({ supervisorEmail });
    res.json({ count: productCount });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({
      message: "Failed to fetch product count. Please try again later.",
    });
  }
});

// Route to fetch products
router.get("/supervisorPage", async (req, res) => {
  const supervisorEmail = req.query.supervisorEmail;
  const category = req.query.category; // Retrieve category from query parameters

  try {
    let products;
    if (category) {
      // If category is provided, fetch products filtered by category
      products = await Product.find({
        supervisorEmail,
        productCategory: category,
      });
    } else {
      // If category is not provided, fetch all products for the supervisor
      products = await Product.find({ supervisorEmail });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// PUT route to update a product by its ID
router.put("/:productId", async (req, res) => {
  const { productId } = req.params; // Extract product ID from request parameters
  const {
    productName,

    productCategory,
    productDescription,
    price,
  } = req.body; // Extract updated product data from request body

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product data
    product.productName = productName;

    product.productCategory = productCategory;
    product.productDescription = productDescription;
    product.price = price;

    // Save the updated product
    await product.save();

    // Return success message
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
