import ApiError from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Agar hamara custom ApiError hai
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Agar koi aur error hai (unexpected)
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
