'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'not available'),
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Products',
    timestamps: true   // ✅ createdAt & updatedAt
  });

  // associations yahan define kr sakte ho
  Product.associate = (models) => {
    // example: Product.hasMany(models.Order)
  };

  return Product;
};
