const mongoose = require("mongoose");

const FEATURES = [
  "hero",
  "showcase",
  "aboutTabs",
  "workProcess",
  "serviceCards",
  "projects",
  "pricing",
  "servicesPage",
  "aboutPage",
  "team",
  "blog",
  "caseStudies",
  "portfolio",
  "seo",
  "aiCalls",
  "users",
  "roles",
];

const ACTIONS = ["view", "create", "update", "delete"];

const PermissionSchema = new mongoose.Schema(
  {
    feature: {
      type: String,
      enum: FEATURES,
      required: true,
    },
    actions: [
      {
        type: String,
        enum: ACTIONS,
      },
    ],
  },
  { _id: false },
);

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: [PermissionSchema],
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

RoleSchema.statics.FEATURES = FEATURES;
RoleSchema.statics.ACTIONS = ACTIONS;

module.exports = mongoose.model("Role", RoleSchema);
