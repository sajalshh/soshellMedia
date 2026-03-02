// One-time migration script: Run with `node utils/migrateUsers.js` from /server directory
// Converts existing users from old role string format to new ObjectId-based role system

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const Role = require("../models/Role");
  const seedSystemRoles = require("./seedRoles");
  await seedSystemRoles();

  const superAdminRole = await Role.findOne({ name: "SuperAdmin" });
  const adminRole = await Role.findOne({ name: "Admin" });

  if (!superAdminRole || !adminRole) {
    console.error("System roles not found. Seed failed.");
    process.exit(1);
  }

  const usersCollection = mongoose.connection.collection("users");
  const users = await usersCollection.find({}).toArray();

  let migrated = 0;
  for (const user of users) {
    // Only migrate users with old string-based role
    if (typeof user.role === "string") {
      const isSuperAdmin = user.role === "client";
      const newRole = isSuperAdmin ? superAdminRole._id : adminRole._id;
      const username =
        user.username || user.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            role: newRole,
            isSuperAdmin: isSuperAdmin,
            username: username,
            isActive: true,
          },
        },
      );
      console.log(
        `Migrated user ${user.email} -> ${isSuperAdmin ? "SuperAdmin" : "Admin"} (username: ${username})`,
      );
      migrated++;
    }
  }

  console.log(`Migration complete. ${migrated} user(s) migrated.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
