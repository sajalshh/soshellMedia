const Role = require("../models/Role");

const FEATURES = Role.FEATURES;

async function seedSystemRoles() {
  try {
    // SuperAdmin role: all features, all actions
    const allPerms = FEATURES.map((f) => ({
      feature: f,
      actions: ["view", "create", "update", "delete"],
    }));

    await Role.findOneAndUpdate(
      { name: "SuperAdmin" },
      {
        name: "SuperAdmin",
        description: "Full system access",
        permissions: allPerms,
        isSystem: true,
      },
      { upsert: true, new: true },
    );

    // Admin role: all features, all actions (but SuperAdmin protection is on User level)
    await Role.findOneAndUpdate(
      { name: "Admin" },
      {
        name: "Admin",
        description: "Administrative access",
        permissions: allPerms,
        isSystem: true,
      },
      { upsert: true, new: true },
    );

    // SEO role: example custom role
    await Role.findOneAndUpdate(
      { name: "SEO" },
      {
        name: "SEO",
        description: "SEO and blog management",
        permissions: [
          { feature: "seo", actions: ["view", "update"] },
          { feature: "blog", actions: ["view", "create", "update"] },
          { feature: "caseStudies", actions: ["view", "create", "update"] },
        ],
        isSystem: false,
      },
      { upsert: true, new: true },
    );

    // Employee role: can only view their own attendance and tasks
    await Role.findOneAndUpdate(
      { name: "Employee" },
      {
        name: "Employee",
        description: "Standard employee access",
        permissions: [
          { feature: "attendance", actions: ["view"] },
          { feature: "tasks", actions: ["view"] },
        ],
        isSystem: true,
      },
      { upsert: true, new: true },
    );

    console.log("System roles seeded.");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
}

module.exports = seedSystemRoles;
