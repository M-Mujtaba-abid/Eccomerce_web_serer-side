import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "not available"),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
  type: DataTypes.ENUM("perfume", "accesories"),
  allowNull: false,
}

  },
  {
    tableName: "Products",
    timestamps: true, // createdAt & updatedAt
  }
);

// agar associations lagani ho
// Product.associate = (models) => {
//   Product.hasMany(models.Order);
// };

export default Product;
