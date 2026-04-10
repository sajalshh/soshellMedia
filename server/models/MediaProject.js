const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    round: { type: Number, required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const MediaProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Assigned team
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedProduction: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedEditor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedDesigner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Production-managed fields
    rawFileLink: { type: String, trim: true, default: "" },
    scriptLink: { type: String, trim: true, default: "" },

    // Editor/Designer-managed fields
    editedFileLink: { type: String, trim: true, default: "" },
    finalLink: { type: String, trim: true, default: "" },
    editorStatus: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    // Client-managed fields
    clientApproval: {
      type: String,
      enum: ["pending", "approved", "not_approved"],
      default: "pending",
    },

    // Feedback history (added by client per round)
    feedback: [FeedbackSchema],
    currentRound: { type: Number, default: 1 },

    // Overall project status
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaProject", MediaProjectSchema);
