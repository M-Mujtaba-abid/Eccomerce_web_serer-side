import stripe from "../config/stripe.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items } = req.body; // items = [{ name, price, quantity }]

  const line_items = items.map(item => ({
    price_data: {
      currency: "pkr", // ya PKR etc
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success/${"{CHECKOUT_SESSION_ID}"}`, // 👈 path param
    // success_url: "http://localhost:5173/success/{CHECKOUT_SESSION_ID}",

    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  res.status(200).json({ url: session.url });
});



export const getCheckoutSession = asyncHandler(async (req, res) => {
  const { id } = req.params; // session_id
  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["payment_intent"],
    });
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

