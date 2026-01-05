const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// 1. Load Environment Variables (to get your MONGO_URI)
dotenv.config();

// 2. Import your Portfolio Model
// NOTE: Adjust the path if your models folder is somewhere else
const PortfolioItem = require("./models/PortfolioItem");

const cleanData = async () => {
  try {
    console.log("🔌 Connecting to Database...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected.");

    // 3. Find and Delete Wistia Items
    console.log("🧹 Scanning for Wistia links...");

    const result = await PortfolioItem.deleteMany({
      videoUrl: { $regex: "wistia", $options: "i" }, // Case-insensitive search for 'wistia'
    });

    console.log("-----------------------------------");
    console.log(`🎉 Success! Deleted ${result.deletedCount} old Wistia items.`);
    console.log("-----------------------------------");

    /* OPTIONAL: UNCOMMENT THE LINE BELOW TO WIPE **EVERYTHING** IN PORTFOLIO INSTEAD
    If you want a totally fresh start (delete ALL items, not just Wistia):
    */
    // const wipeAll = await PortfolioItem.deleteMany({}); console.log(`Deleted ALL ${wipeAll.deletedCount} items.`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

cleanData();
