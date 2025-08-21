const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PortfolioItem = require("./models/PortfolioItem");
const PortfolioCategory = require("./models/PortfolioCategory");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const migrateData = async () => {
  await connectDB();

  try {
    const categories = await PortfolioCategory.find({});
    const items = await PortfolioItem.find({});

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("Found categories:", categoryMap);

    for (const item of items) {

      if (typeof item.category === "string" && categoryMap[item.category]) {
        console.log(
          `Migrating item: "${item.title}" from category "${item.category}"...`,
        );
        item.category = categoryMap[item.category];
        await item.save();
        console.log(`...Success!`);
      } else {
        console.log(
          `Skipping item: "${item.title}" (already migrated or no matching category)`,
        );
      }
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

migrateData();
