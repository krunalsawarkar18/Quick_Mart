import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import Cart from "../models/Cart.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import slugify from "../utils/slugify.js";

dotenv.config();

const requireSeedValue = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required seed environment variable: ${key}`);
  }

  return value;
};

const categories = [
  {
    name: "Fresh Fruits",
    description: "Sweet seasonal fruits and everyday essentials."
  },
  {
    name: "Vegetables",
    description: "Farm fresh greens, roots, and daily cooking picks."
  },
  {
    name: "Dairy & Bakery",
    description: "Breakfast staples, breads, milk, and more."
  },
  {
    name: "Snacks",
    description: "Quick bites for work, travel, and late-night cravings."
  }
];

const products = [
  {
    name: "Premium Alphonso Mango",
    description: "Handpicked ripe mangoes with rich aroma and soft golden pulp.",
    price: 299,
    discountPrice: 249,
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Fresh Fruits",
    tags: ["fruit", "mango", "seasonal"]
  },
  {
    name: "Farm Fresh Spinach",
    description: "Tender spinach leaves packed with freshness and color.",
    price: 65,
    discountPrice: 49,
    stock: 55,
    imageUrl:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Vegetables",
    tags: ["green", "healthy", "leafy"]
  },
  {
    name: "Whole Wheat Bread",
    description: "Soft bakery bread made for breakfast, sandwiches, and snacks.",
    price: 55,
    discountPrice: 45,
    stock: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["bread", "bakery", "breakfast"]
  },
  {
    name: "Sea Salt Potato Chips",
    description: "Crispy kettle-cooked chips with a balanced salty finish.",
    price: 80,
    discountPrice: 69,
    stock: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Snacks",
    tags: ["chips", "snack", "quick"]
  },
  {
    name: "Organic Bananas",
    description: "Naturally sweet bananas perfect for breakfast bowls and shakes.",
    price: 75,
    discountPrice: 59,
    stock: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Fresh Fruits",
    tags: ["banana", "fruit", "organic"]
  },
  {
    name: "Crisp Red Apples",
    description: "Juicy apples with a sweet crunch for lunchboxes and healthy snacking.",
    price: 180,
    discountPrice: 149,
    stock: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Fresh Fruits",
    tags: ["apple", "fruit", "fresh"]
  },
  {
    name: "Seedless Green Grapes",
    description: "Refreshing bite-sized grapes ideal for salads, desserts, and quick munching.",
    price: 160,
    discountPrice: 139,
    stock: 44,
    imageUrl:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Fresh Fruits",
    tags: ["grapes", "fruit", "snack"]
  },
  {
    name: "Sweet Pineapple Rings",
    description: "Golden pineapple slices with tropical sweetness for juices, salads, and snacking.",
    price: 140,
    discountPrice: 118,
    stock: 38,
    imageUrl:
      "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Fresh Fruits",
    tags: ["pineapple", "fruit", "tropical"]
  },
  {
    name: "Juicy Watermelon Cubes",
    description: "Chilled watermelon portions packed for summer hydration and quick dessert bowls.",
    price: 110,
    discountPrice: 89,
    stock: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Fresh Fruits",
    tags: ["watermelon", "fruit", "summer"]
  },
  {
    name: "Strawberry Punnet",
    description: "Bright, sweet strawberries packed for desserts, smoothies, and lunchbox snacking.",
    price: 165,
    discountPrice: 139,
    stock: 36,
    imageUrl:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Fresh Fruits",
    tags: ["strawberry", "fruit", "berries"]
  },
  {
    name: "Kiwi Fruit Pack",
    description: "Tangy-sweet kiwi fruits with vibrant green flesh for bowls, smoothies, and salads.",
    price: 190,
    discountPrice: 164,
    stock: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Fresh Fruits",
    tags: ["kiwi", "fruit", "fresh"]
  },
  {
    name: "Pomegranate Pearls Box",
    description: "Ruby pomegranate arils ready to top yogurt bowls, chaats, and fruit platters.",
    price: 155,
    discountPrice: 132,
    stock: 34,
    imageUrl:
      "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Fresh Fruits",
    tags: ["pomegranate", "fruit", "premium"]
  },
  {
    name: "Classic Butter Croissant",
    description: "Flaky bakery croissant with buttery layers and a soft center.",
    price: 95,
    discountPrice: 79,
    stock: 26,
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Dairy & Bakery",
    tags: ["croissant", "bakery", "fresh"]
  },
  {
    name: "Baby Carrots Pack",
    description: "Sweet, washed carrots ready for curries, salads, and healthy dipping.",
    price: 72,
    discountPrice: 58,
    stock: 52,
    imageUrl:
      "https://images.unsplash.com/photo-1447175008436-170170753d52?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Vegetables",
    tags: ["carrot", "vegetable", "fresh"]
  },
  {
    name: "Garden Tomatoes",
    description: "Bright red tomatoes with a balanced tang for gravies, salads, and sandwiches.",
    price: 68,
    discountPrice: 54,
    stock: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Vegetables",
    tags: ["tomato", "vegetable", "kitchen"]
  },
  {
    name: "Cauliflower Florets",
    description: "Fresh cauliflower trimmed for easy cooking in stir-fries and curries.",
    price: 88,
    discountPrice: 74,
    stock: 36,
    imageUrl:
      "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Vegetables",
    tags: ["cauliflower", "vegetable", "fresh"]
  },
  {
    name: "Green Bell Peppers",
    description: "Crisp capsicum perfect for noodles, stir-fries, pizzas, and colorful salads.",
    price: 92,
    discountPrice: 78,
    stock: 41,
    imageUrl:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Vegetables",
    tags: ["capsicum", "vegetable", "crisp"]
  },
  {
    name: "Fresh Broccoli Crowns",
    description: "Tender broccoli florets ideal for soups, stir-fries, and healthy meal prep.",
    price: 105,
    discountPrice: 89,
    stock: 33,
    imageUrl:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Vegetables",
    tags: ["broccoli", "vegetable", "healthy"]
  },
  {
    name: "English Cucumber",
    description: "Cool, crunchy cucumber perfect for salads, sandwiches, and detox water.",
    price: 52,
    discountPrice: 42,
    stock: 57,
    imageUrl:
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Vegetables",
    tags: ["cucumber", "vegetable", "hydrating"]
  },
  {
    name: "Purple Onion Basket",
    description: "Kitchen staple onions with sharp flavor for curries, gravies, and stir-fries.",
    price: 60,
    discountPrice: 48,
    stock: 68,
    imageUrl:
      "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Vegetables",
    tags: ["onion", "vegetable", "kitchen"]
  },
  {
    name: "French Beans Pack",
    description: "Tender green beans trimmed and ready for sauteed sides, curries, and pulao.",
    price: 78,
    discountPrice: 63,
    stock: 46,
    imageUrl:
      "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Vegetables",
    tags: ["beans", "vegetable", "fresh"]
  },
  {
    name: "Farmhouse Paneer",
    description: "Soft paneer cubes rich in protein and perfect for grills, curries, and wraps.",
    price: 120,
    discountPrice: 99,
    stock: 34,
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Dairy & Bakery",
    tags: ["paneer", "dairy", "protein"]
  },
  {
    name: "Greek Yogurt Cup",
    description: "Creamy strained yogurt with a smooth texture for breakfast and smoothies.",
    price: 85,
    discountPrice: 69,
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["yogurt", "dairy", "breakfast"]
  },
  {
    name: "Chocolate Chip Muffins",
    description: "Moist bakery muffins loaded with chocolate chips for tea-time treats.",
    price: 110,
    discountPrice: 92,
    stock: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["muffin", "bakery", "dessert"]
  },
  {
    name: "Fresh Cream Milk",
    description: "Rich full-cream milk for tea, coffee, breakfast cereals, and daily cooking.",
    price: 68,
    discountPrice: 58,
    stock: 54,
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["milk", "dairy", "daily"]
  },
  {
    name: "Salted Table Butter",
    description: "Smooth creamy butter for toast, parathas, baking, and everyday cooking.",
    price: 72,
    discountPrice: 61,
    stock: 43,
    imageUrl:
      "https://images.unsplash.com/photo-1589985270958-b3f5f0b4f7b2?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["butter", "dairy", "spread"]
  },
  {
    name: "Sourdough Loaf",
    description: "Artisan-style sourdough bread with a crusty edge and soft chewy crumb.",
    price: 135,
    discountPrice: 114,
    stock: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Dairy & Bakery",
    tags: ["bread", "bakery", "artisan"]
  },
  {
    name: "Cheddar Cheese Slices",
    description: "Mild cheddar slices for burgers, grilled sandwiches, wraps, and quick snacks.",
    price: 125,
    discountPrice: 106,
    stock: 37,
    imageUrl:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Dairy & Bakery",
    tags: ["cheese", "dairy", "sandwich"]
  },
  {
    name: "Multigrain Burger Buns",
    description: "Soft seeded buns baked for burgers, sliders, breakfast sandwiches, and snack platters.",
    price: 75,
    discountPrice: 62,
    stock: 31,
    imageUrl:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Dairy & Bakery",
    tags: ["buns", "bakery", "multigrain"]
  },
  {
    name: "Masala Roasted Peanuts",
    description: "Crunchy peanuts coated with bold spices for a satisfying savory bite.",
    price: 65,
    discountPrice: 52,
    stock: 64,
    imageUrl:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Snacks",
    tags: ["peanuts", "snack", "masala"]
  },
  {
    name: "Cheese Nacho Chips",
    description: "Corn chips with a cheesy punch that pair well with dips and movie nights.",
    price: 95,
    discountPrice: 79,
    stock: 46,
    imageUrl:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Snacks",
    tags: ["nachos", "chips", "snack"]
  },
  {
    name: "Oats Energy Bar",
    description: "Wholesome snack bar with oats and nuts for an easy on-the-go boost.",
    price: 45,
    discountPrice: 35,
    stock: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1582048093005-f87a2b8d4a24?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Snacks",
    tags: ["energy bar", "snack", "oats"]
  },
  {
    name: "Peri Peri Popcorn",
    description: "Light popcorn tossed with tangy peri peri seasoning for movie nights and quick cravings.",
    price: 55,
    discountPrice: 45,
    stock: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Snacks",
    tags: ["popcorn", "snack", "peri peri"]
  },
  {
    name: "Cocoa Sandwich Cookies",
    description: "Chocolate sandwich cookies with creamy filling for tea breaks and lunchbox treats.",
    price: 70,
    discountPrice: 58,
    stock: 62,
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Snacks",
    tags: ["cookies", "snack", "chocolate"]
  },
  {
    name: "Trail Mix Crunch",
    description: "A balanced mix of nuts, seeds, and dried fruit for smart everyday snacking.",
    price: 115,
    discountPrice: 96,
    stock: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Snacks",
    tags: ["trail mix", "snack", "nuts"]
  },
  {
    name: "Baked Khakhra Crisps",
    description: "Thin roasted whole-wheat crisps with masala seasoning for guilt-light snacking.",
    price: 60,
    discountPrice: 49,
    stock: 66,
    imageUrl:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80",
    featured: false,
    categoryName: "Snacks",
    tags: ["khakhra", "snack", "baked"]
  },
  {
    name: "Dark Chocolate Granola Bites",
    description: "Crunchy bite-size granola clusters finished with dark chocolate for an easy pick-me-up.",
    price: 90,
    discountPrice: 74,
    stock: 52,
    imageUrl:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    featured: true,
    categoryName: "Snacks",
    tags: ["granola", "snack", "chocolate"]
  }
];

const runSeed = async () => {
  await connectDb();

  const adminEmail = requireSeedValue("SEED_ADMIN_EMAIL");
  const adminPassword = requireSeedValue("SEED_ADMIN_PASSWORD");
  const customerEmail = requireSeedValue("SEED_CUSTOMER_EMAIL");
  const customerPassword = requireSeedValue("SEED_CUSTOMER_PASSWORD");

  await Promise.all([
    Order.deleteMany(),
    Cart.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    User.deleteMany()
  ]);

  const insertedCategories = await Category.insertMany(
    categories.map((category) => ({
      ...category,
      slug: slugify(category.name)
    }))
  );

  const categoryMap = insertedCategories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
  }, {});

  await Product.insertMany(
    products.map((product) => ({
      name: product.name,
      slug: slugify(product.name),
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      featured: product.featured,
      category: categoryMap[product.categoryName],
      tags: product.tags
    }))
  );

  const admin = await User.create({
    name: "Quick Market Admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
    phone: "9999999999"
  });

  const customer = await User.create({
    name: "Demo Customer",
    email: customerEmail,
    password: customerPassword,
    role: "customer",
    phone: "8888888888"
  });

  await Cart.insertMany([
    { user: admin._id, items: [] },
    { user: customer._id, items: [] }
  ]);

  console.log("Seed completed");
  console.log(`Admin account created: ${adminEmail}`);
  console.log(`Customer account created: ${customerEmail}`);

  await mongoose.connection.close();
};

runSeed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
