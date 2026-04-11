import mongoose from "mongoose";

const deliverySettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default"
    },
    charge: {
      type: Number,
      min: 0,
      default: 40
    },
    freeDeliveryThreshold: {
      type: Number,
      min: 0,
      default: 799
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

const DeliverySetting = mongoose.model("DeliverySetting", deliverySettingSchema);

export default DeliverySetting;
