const Role = require("../models/Role");

const FEATURES = Role.FEATURES;

// All permissions on every feature
const allPerms = FEATURES.map((f) => ({
  feature: f,
  actions: ["view", "create", "update", "delete"],
}));

async function seedSystemRoles() {
  try {
    // SuperAdmin — full system access
    await Role.findOneAndUpdate(
      { name: "SuperAdmin" },
      { name: "SuperAdmin", description: "Full system access", permissions: allPerms, isSystem: true },
      { upsert: true, new: true }
    );

    // Admin — full system access (user-level distinction from SuperAdmin)
    await Role.findOneAndUpdate(
      { name: "Admin" },
      { name: "Admin", description: "Administrative access", permissions: allPerms, isSystem: true },
      { upsert: true, new: true }
    );

    // Owner — full access to media projects + user management
    await Role.findOneAndUpdate(
      { name: "Owner" },
      {
        name: "Owner",
        description: "Full access to media production management",
        permissions: allPerms,
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Production — create/edit projects; manage raw files and scripts
    await Role.findOneAndUpdate(
      { name: "Production" },
      {
        name: "Production",
        description: "Can create and manage production data, client assignment, raw files, scripts",
        permissions: [
          { feature: "mediaProjects", actions: ["view", "create", "update"] },
          { feature: "users", actions: ["view"] },
        ],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Editor — view production data, manage edited file, final link, status
    await Role.findOneAndUpdate(
      { name: "Editor" },
      {
        name: "Editor",
        description: "Can view production data and manage edited file links and delivery status",
        permissions: [
          { feature: "mediaProjects", actions: ["view", "update"] },
        ],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Designer — same access as Editor
    await Role.findOneAndUpdate(
      { name: "Designer" },
      {
        name: "Designer",
        description: "Can view production data and manage edited file links and delivery status",
        permissions: [
          { feature: "mediaProjects", actions: ["view", "update"] },
        ],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Client — view edited/final links, give feedback, approve
    await Role.findOneAndUpdate(
      { name: "Client" },
      {
        name: "Client",
        description: "Can view delivered files, submit feedback, and approve projects",
        permissions: [
          { feature: "mediaProjects", actions: ["view", "update"] },
        ],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // SEO role
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
      { upsert: true, new: true }
    );

    // Employee role
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
      { upsert: true, new: true }
    );

    console.log("System roles seeded.");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }
}

module.exports = seedSystemRoles;
