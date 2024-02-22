// models/Product_model.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    default: "",
  },
  supervisorEmail: {
    type: String,
    default: "",
  },
  productId:{
    type: String,
    default: "",
  },
  productName: {
    type: String,
    default: "",
  },
  productImage: {
    type: String,
    default: "",
  },
  productCategory: {
    type: String,
    default: "",
  },
  productDescription: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
