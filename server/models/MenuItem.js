import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Rice Dishes",
        "Soups & Swallow",
        "Protein",
        "Small Chops",
        "Drinks",
        "Extras",
      ],
    },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    prepTimeMinutes: { type: Number, default: 25 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text" });

export default mongoose.model("MenuItem", menuItemSchema);
