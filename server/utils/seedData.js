import dotenv from "dotenv";
import connectDB from "../config/db.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const menuItems = [
  {
    name: "Jollof Rice & Chicken",
    description: "Smoky party-style jollof rice served with a grilled chicken thigh.",
    price: 3500,
    category: "Rice Dishes",
    isSpicy: true,
    tags: ["popular", "rice"],
  },
  {
    name: "Fried Rice & Turkey",
    description: "Vegetable-packed fried rice with a crispy turkey portion.",
    price: 3800,
    category: "Rice Dishes",
    tags: ["popular"],
  },
  {
    name: "Ofada Rice & Ayamase Sauce",
    description: "Local ofada rice paired with rich green pepper ayamase stew and assorted meat.",
    price: 4200,
    category: "Rice Dishes",
    isSpicy: true,
  },
  {
    name: "Amala & Ewedu with Gbegiri",
    description: "Smooth amala served with ewedu and gbegiri soup, topped with assorted meat.",
    price: 3200,
    category: "Soups & Swallow",
  },
  {
    name: "Pounded Yam & Egusi Soup",
    description: "Freshly pounded yam with melon seed soup, stockfish and beef.",
    price: 3500,
    category: "Soups & Swallow",
  },
  {
    name: "Semo & Afang Soup",
    description: "Semovita swallow with vegetable-rich afang soup and periwinkle.",
    price: 3600,
    category: "Soups & Swallow",
  },
  {
    name: "Suya (Beef Skewers)",
    description: "Spicy grilled beef skewers coated in traditional suya spice (yaji).",
    price: 2500,
    category: "Protein",
    isSpicy: true,
    tags: ["popular"],
  },
  {
    name: "Grilled Fish (Titus)",
    description: "Whole grilled titus fish seasoned with pepper and onions.",
    price: 4000,
    category: "Protein",
  },
  {
    name: "Peppered Gizzard",
    description: "Diced gizzard tossed in a fiery pepper sauce with onions and bell peppers.",
    price: 2800,
    category: "Protein",
    isSpicy: true,
  },
  {
    name: "Small Chops Combo",
    description: "Assorted mix of spring rolls, puff puff, samosa, and chicken lollipops.",
    price: 4500,
    category: "Small Chops",
    tags: ["party", "popular"],
  },
  {
    name: "Chicken Lollipops (6pcs)",
    description: "Crispy fried chicken lollipops with a side of pepper sauce.",
    price: 3000,
    category: "Small Chops",
  },
  {
    name: "Chapman",
    description: "Classic Nigerian mocktail with Fanta, Sprite, grenadine, and cucumber.",
    price: 1500,
    category: "Drinks",
  },
  {
    name: "Zobo Drink",
    description: "Chilled hibiscus zobo infused with ginger, pineapple, and cloves.",
    price: 1200,
    category: "Drinks",
  },
  {
    name: "Bottled Water",
    description: "50cl chilled bottled water.",
    price: 300,
    category: "Drinks",
  },
  {
    name: "Fried Plantain (Dodo)",
    description: "Sweet golden fried plantain slices.",
    price: 1000,
    category: "Extras",
  },
  {
    name: "Moin Moin",
    description: "Steamed bean pudding with egg and fish filling.",
    price: 1200,
    category: "Extras",
  },
];

const seed = async () => {
  try {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items`);

    const adminExists = await User.findOne({ email: "admin@mamaskitchen.com" });
    if (!adminExists) {
      await User.create({
        name: "Restaurant Admin",
        email: "admin@mamaskitchen.com",
        password: "admin1234",
        phone: "08000000000",
        role: "admin",
      });
      console.log("Seeded admin user -> admin@mamaskitchen.com / admin1234");
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
