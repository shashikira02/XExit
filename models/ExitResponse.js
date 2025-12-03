const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const ExitResponseSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    responses: [ResponseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExitResponse", ExitResponseSchema);
