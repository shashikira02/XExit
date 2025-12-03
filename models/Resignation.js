const mongoose = require("mongoose");

const ResignationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedDate: {
      type: Date,
      required: true,
    },
    status:{
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    exitDate: {
      type: Date,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resignation", ResignationSchema);
