import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/postproduct",  upload.single("productImage"), createProduct);
router.get("/getallproduct", getAllProducts);
router.get("/getsingleproduct/:id", getProductById);
router.patch("/updateproduct/:id", upload.single("productImage") ,updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.get("/search",searchProducts);
router.get("/getproductbycategory/:category",getProductsByCategory);
// router.delete("/search",searchProducts);



export default router;
