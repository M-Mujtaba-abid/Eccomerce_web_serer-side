import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken" 
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// const registerUser = asyncHandler(async (req, res, next) => {
//   const { firstName, lastName, email, password, phoneNumber, address, userRole } = req.body;

//   const {profileImage} = req.file

//  // Upload image using stream
//   const streamUpload = (reqFile) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "products" },
//         (error, result) => {
//           if (result) resolve(result);
//           else reject(error);
//         }
//       );
//       streamifier.createReadStream(reqFile.buffer).pipe(stream);
//     });
//   };

//   uploadedImage = await streamUpload(profileImage);

//   // 1️⃣ Validate required fields
//   if (!firstName || !lastName || !email || !password) {
//     return next(new ApiError(400, "First name, last name, email, and password are required"));
//   }

//   // 2️⃣ Check if email already exists
//   const existingUser = await User.findOne({ where: { email } });
//   if (existingUser) {
//     return next(new ApiError(400, "Email already registered"));
//   }

//   // 3️⃣ Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 4️⃣ Create user
//   const newUser = await User.create({
//     firstName,
//     lastName,
//     email,
//     password: hashedPassword,
//     phoneNumber,
//     address,
//     userRole: userRole || "user",
//     profileImage,
//   });

//   // 5️⃣ Remove password before sending response
//   const userResponse = {
//     id: newUser.id,
//     firstName: newUser.firstName,
//     lastName: newUser.lastName,
//     email: newUser.email,
//     phoneNumber: newUser.phoneNumber,
//     address: newUser.address,
//     userRole: newUser.userRole,
//     profileImage: newUser.profileImage,
//     status: newUser.status,
//     createdAt: newUser.createdAt,
//   };

//   // 6️⃣ Send success response
//   res.status(201).json(new ApiResponse(201, userResponse, "User registered successfully"));
// });

const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, address, userRole } = req.body;

  // Check if file uploaded
  if (!req.file) {
    return next(new ApiError(400, "Profile image is required"));
  }

  // Upload image using stream
  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "users" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(reqFile.buffer).pipe(stream);
    });
  };

  const uploadedImage = await streamUpload(req.file);

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return next(new ApiError(400, "First name, last name, email, and password are required"));
  }

  // Check if email exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError(400, "Email already registered"));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    address,
    userRole: userRole || "User",
    profileImage: uploadedImage.secure_url,
  });

  // Prepare response
  const userResponse = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    address: newUser.address,
    userRole: newUser.userRole,
    profileImage: newUser.profileImage,
    status: newUser.status,
    createdAt: newUser.createdAt,
  };

  res.status(201).json(new ApiResponse(201, userResponse, "User registered successfully"));
});

 const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password , userRole } = req.body;

  // 1️⃣ Validate input
  if (!email || !password ) {
    return next(new ApiError(400, "Email and password are required"));
  }

  // 2️⃣ Check user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  // 3️⃣ Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  if (userRole && userRole !== user.userRole) {
    return next(new ApiError(403, "You are not authorized for this role"));
  }

  // 4️⃣ Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 5️⃣ Prepare response (remove password)
  const userResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    userRole: user.userRole,
    profileImage: user.profileImage,
    status: user.status,
    createdAt: user.createdAt,
  };

  // 6️⃣ Send response with cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(new ApiResponse(200, { user: userResponse, token }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});


export {registerUser ,loginUser, logoutUser}