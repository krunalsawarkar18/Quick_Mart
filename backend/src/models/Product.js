import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    tags: [String]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

