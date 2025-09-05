// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,       // database name
//   process.env.DB_USER,       // username
//   process.env.DB_PASS,       // password
//   {
//     host: process.env.DB_HOST,   // e.g. localhost
//     dialect: "mysql",
//     logging: false,              // true karo agar queries console me dekhni ho
//   }
// );

// // test connection
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Database connected with Sequelize");
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//   }
// };

// export { sequelize, connectDB };

// config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // important for hosted Postgres
      },
    },
  }
);

// Optional: Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres + Sequelize connected successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

