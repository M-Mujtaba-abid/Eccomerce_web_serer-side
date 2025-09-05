import express from "express";
import { createCheckoutSession, getCheckoutSession } from "../controllers/payment.controller.js";

const route = express.Router();

route.post("/create-checkout-session", createCheckoutSession);
route.get("/sessionsuccess/:id", getCheckoutSession);


export default route;
