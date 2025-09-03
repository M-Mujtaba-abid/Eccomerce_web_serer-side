import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token 

    console.log("ye token arha he ",token )

    if (!token) return res.status(401).json({ message: "Unauthorized, No Token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.id);

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
