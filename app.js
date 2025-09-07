// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// // import { connectDB, sequelize } from "./config/db.js";
// import errorMiddleware from "./middleware/errorMiddleware.js";
// import UserRoute from "./routes/user.route.js";
// import ProductRoute from "./routes/product.route.js";
// import cartItemRoute from "./routes/cartItem.route.js";
// import orderRoute from "./routes/order.route.js";
// import paymentRoute from "./routes/payment.route.js";

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173", // front-end URL
//     credentials: true, // ✅ cookies ke liye required
//   })
// );
// app.use(express.json());
// app.use(cookieParser()); // <-- Add this line

// app.use("/user",UserRoute )
// app.use("/product",ProductRoute )
// app.use("/cartitem",cartItemRoute )
// app.use("/order",orderRoute )
// app.use("/payment",paymentRoute)

// // app.use("/orderitem",orderItemRoute )



// // Test route
// app.get("/", (req, res) => {
//   res.send("Ecommerce API Running...");
// });



// // Connect DB
// // connectDB();
// // sequelize.sync({ alter: true });

// // 👇 Error middleware last me lagana
// app.use(errorMiddleware);


// export  default app





// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// Import routes
import UserRoute from "./routes/user.route.js";
import ProductRoute from "./routes/product.route.js";
import cartItemRoute from "./routes/cartItem.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";

const app = express();

// ------------------- Middleware -------------------

// CORS for Vercel frontend
app.use(cors({
  origin: "https://theluxuryfragrances.vercel.app" |"https://eccomerce-web-admin-and-client-side.vercel.app", // no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true, // for cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());

// ------------------- Routes -------------------

app.use("/user", UserRoute);
app.use("/product", ProductRoute);
app.use("/cartitem", cartItemRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce API Running...");
});

// Error middleware (last)
app.use(errorMiddleware);

// ------------------- Database & Server -------------------

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test DB connection
    console.log("Postgres + Sequelize connected successfully");

    await sequelize.sync({ alter: true }); // Sync all models
    console.log("All models synced successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // stop server if DB fails
  }
};

startServer();

export default app;
