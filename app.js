import express from "express";
import cors from "cors";
// import { connectDB, sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import UserRoute from "./routes/user.route.js";
const app = express();

app.use(cors());
app.use(express.json());




app.use("/user",UserRoute )



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