import express from "express";
import cors from "cors";
// import { connectDB, sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import UserRoute from "./routes/user.route.js";
import ProductRoute from "./routes/product.route.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // front-end URL
    credentials: true, // ✅ cookies ke liye required
  })
);
app.use(express.json());




app.use("/user",UserRoute )
app.use("/product",ProductRoute )



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