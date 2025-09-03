import express from "express"
import { createOrder, deleteOrder, getUserOrders, updateOrderStatus } from "../controllers/orders.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const route=express.Router()


route.post("/create", isAuthenticated, createOrder);
route.get("/myorders", isAuthenticated, getUserOrders);
route.patch("/update/:id", isAuthenticated, updateOrderStatus);
route.delete("/delete/:id", isAuthenticated, deleteOrder);



export default route