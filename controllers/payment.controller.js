import Stripe from "stripe";
import stripe from "../config/stripe.js";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();


export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { 
    items, 
    userId, 
    customerName, 
    customerEmail, 
    customerPhone, 
    shippingStreet, 
    shippingCity, 
    shippingState, 
    shippingPostalCode, 
    shippingCountry, 
    totalAmount 
  } = req.body;

  // Stripe line items
  const line_items = items.map((item) => ({
    price_data: {
      currency: "pkr", // tumhare hisaab se
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // stripe me amount in cents
    },
    quantity: item.quantity,
  }));

  // Checkout Session create
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/web/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/web/cancel`,

    // 👇 Metadata bhejna bohot important hai
    metadata: {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      totalAmount,
    },
  });

  res.status(200).json({ 
  id: session.id,   // 🔹 ye stripe ka sessionId (cs_test_xxx)
  url: session.url 
});
});



// controllers/paymentController.js
export const sessionSuccess = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details", "payment_intent"],
    });

     res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session", error });
  }
});
