const Resignation = require("../models/Resignation");
const ExitResponse = require("../models/ExitResponse");
const { sendMail } = require("../services/mailService");

const viewResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find().populate(
      "employeeId",
      "username"
    );

    const formattedDate = resignations.map((reg) => ({
      _id: reg._id,
      employeeId: reg.employeeId.username,
      requestedDate: reg.requestedDate,
      status: reg.status,
    }));

    return res.status(200).json({ data: formattedDate });
  } catch (error) {
    console.error("VIEW RESIGNATIONS ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const concludeResignation = async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body;

    if (!resignationId || approved === undefined)
      return res
        .status(400)
        .json({ error: "resignationId and approved are required" });

    const resignation = await Resignation.findById(resignationId).populate(
      "employeeId"
    );

    if (!resignation)
      return res.status(404).json({ error: "Resignation not found" });

    resignation.status = approved ? "approved" : "rejected";

    if (approved) {
      const parsedDate = new Date(lwd);
      if (isNaN(parsedDate.getTime()))
        return res.status(400).json({ error: "Invalid last working date" });
      resignation.exitDate = parsedDate;
    }

    await resignation.save();

    try {
      await sendMail({
        to: resignation.employeeId.username,
        subject: approved
          ? "Your Resignation Has Been Approved"
          : "Your Resignation Has Been Rejected",
        text: approved
          ? `Your resignation is approved. Exit Date: ${resignation.exitDate}`
          : `Your resignation is rejected.`,
      });
    } catch (mailError) {
      console.warn("Email sending failed:", mailError.message);
    }

    return res.status(200).json({ message: "Registration updated" });
  } catch (error) {
    console.error("CONCLUDE ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const viewExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find().populate(
      "employeeId",
      "username"
    );

    const formatted = responses.map((res) => ({
      employeeId: res.employeeId._id,
      responses: res.responses,
    }));

    return res.status(200).json({data: formatted})
  } catch (error) {
    console.error("VIEW EXIT RESPONSES ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {viewResignations, concludeResignation, viewExitResponses}
