import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: String,
    imageUrl: String,
    price: Number,
    quantity: Number
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [orderItemSchema],
    address: addressSnapshotSchema,
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Stripe"],
      default: "Cash on Delivery"
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    itemsPrice: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 40
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending"
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true
    },
    stripePaymentIntentId: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
