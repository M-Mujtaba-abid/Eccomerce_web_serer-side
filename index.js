// import dotenv from "dotenv"
// import app from "./app.js"
// import { connectDB } from "./config/db.js";
// dotenv.config()


//  const port=process.env.PORT

// connectDB();

// app.listen(port,()=>{
//     console.log("server is running on port ",port)
// })


// index.js
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

// Database connect
connectDB();

// Local vs Production handling
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`✅ Server running locally on port ${port}`);
  });
}

// Vercel ke liye `export default app` zaroori hai
export default app;
