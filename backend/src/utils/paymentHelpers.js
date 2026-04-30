import Stripe from "stripe";

export const getStripeClient = () =>
  process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const getStripePaymentIntentId = (session) =>
  typeof session?.payment_intent === "string" ? session.payment_intent : session?.payment_intent?.id || "";

export const refundStripePayment = async (stripe, paymentIntentId, reason) => {
  if (!stripe) {
    throw new Error("Stripe is not configured on the server");
  }

  if (!paymentIntentId) {
    throw new Error("Stripe payment intent not found for this order");
  }

  const payload = {
    payment_intent: paymentIntentId
  };

  if (reason) {
    payload.reason = reason;
  }

  return stripe.refunds.create(payload);
};
