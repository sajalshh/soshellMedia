const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");

async function seedOwner() {
  try {
    // Find the Owner role
    const ownerRole = await Role.findOne({ name: "Owner" });
    if (!ownerRole) {
      console.warn("Owner role not found — skipping owner seed. Run seedRoles first.");
      return;
    }

    // Hash password with 12 rounds (strong encryption)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("Tallu#240398", salt);

    // Check if owner already exists
    const existing = await User.findOne({ username: "jatin" });
    if (existing) {
      // Ensure role, isSuperAdmin, and password are all correct
      await User.findByIdAndUpdate(existing._id, {
        role: ownerRole._id,
        isSuperAdmin: true,
        isActive: true,
        password: hashedPassword,
      });
      console.log("Owner user 'jatin' verified and password synced.");
      return;
    }

    await User.create({
      username: "jatin",
      email: "jatin@soshellmedia.co",
      password: hashedPassword,
      role: ownerRole._id,
      isSuperAdmin: true,
      isActive: true,
    });

    console.log("Owner user 'jatin' seeded successfully.");
  } catch (error) {
    console.error("Error seeding owner:", error);
  }
}

module.exports = seedOwner;
