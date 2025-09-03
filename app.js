import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { connectDB, sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import UserRoute from "./routes/user.route.js";
import ProductRoute from "./routes/product.route.js";
import cartItemRoute from "./routes/cartItem.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // front-end URL
    credentials: true, // ✅ cookies ke liye required
  })
);
app.use(express.json());
app.use(cookieParser()); // <-- Add this line

app.use("/user",UserRoute )
app.use("/product",ProductRoute )
app.use("/cartitem",cartItemRoute )
app.use("/order",orderRoute )
app.use("/payment",paymentRoute )
// app.use("/orderitem",orderItemRoute )



// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce API Running...");
});



// Connect DB
// connectDB();
// sequelize.sync({ alter: true });

// 👇 Error middleware last me lagana
app.use(errorMiddleware);


export  default app