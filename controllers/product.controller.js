// server/controllers/product.controller.js
import  Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";





export const createProduct = asyncHandler(async (req, res, next) => { 
  const { title, description, status, price, stock, category, Quantity } = req.body;

  // Yahan logical OR (||) use karein, aur Quantity ka Q capital hai
  if (
    !title ||
    !description ||
    !status ||
    !price ||
    !stock ||
    !req.file ||

    !Quantity ||
    !category
  ) {
    return next(new ApiError(400, "All fields are required line 29 "));
  }

  let uploadedImage;

  // Upload image using stream
  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(reqFile.buffer).pipe(stream);
    });
  };

  uploadedImage = await streamUpload(req.file);

  // Create product
  const newProduct = await Product.create({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage: uploadedImage.secure_url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
});
// ✅ Get All Products
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll();

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Single Product by ID
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ✅ Update Product
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status, price, stock, category, Quantity } = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  let uploadedImageUrl = product.productImage; // default: old image

  if (req.file) {
    const streamUpload = (reqFile) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(reqFile.buffer).pipe(stream);
      });
    };

    const uploadedImage = await streamUpload(req.file);
    uploadedImageUrl = uploadedImage.secure_url;
  }

  // Update product fields
  await product.update({
    title,
    description,
    status,
    price,
    stock,
    category,
    Quantity,
    productImage: uploadedImageUrl, // old or new
  });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ✅ Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  await product.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

//searchProducts
export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;  // query param ?q=apple

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { category: { [Op.like]: `%${q}%` } },
        ],
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Products by Category
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params; // path param /product/category/:category

  if (!category) {
    return next(new ApiError(400, "Category is required"));
  }
  
  // Validate category against enum values
  const allowedCategories = ["perfume", "accesories"];
  if (!allowedCategories.includes(category.toLowerCase())) {
    return next(new ApiError(400, "Invalid category"));
  }

  const products = await Product.findAll({
    where: { category: category.toLowerCase() },
  });

  if (products.length === 0) {
    return next(new ApiError(404, "No products found in this category"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, products, `Products in category: ${category}`));
});


// ✅ Get Number of Total Products
export const getNumberOfTotalproduct = asyncHandler(async (req, res, next) => {
  try {
    
    const totalProducts = await Product.count(); // Sequelize ka built-in count method

    res
      .status(200)
      .json(new ApiResponse(200, { totalProducts }, "Total products count fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, "Failed to fetch total products count"));
  }
});


