import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const route = express.Router();

route.post("/create-checkout-session", createCheckoutSession);

export default route;
