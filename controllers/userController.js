const Resignation = require("../models/Resignation");
const ExitResponse = require("../models/ExitResponse");
const User = require("../models/User");

const { isWeekend, isHoliday } = require("../services/calendarificService");

const submitResignation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lwd } = req.body;

    if (!lwd)
      return res.status(400).json({ error: "Last Working day is required" });

    const parsedDate = new Date(lwd);
    if (isNaN(parsedDate.getTime()))
      return res.status(400).json({ error: "Invalid date format" });

    if (isWeekend(lwd)) {
      return res
        .status(400)
        .json({ error: "Last Working day cannot be on Weekend" });
    }

    const user = await User.findById(userId);
    const country = user?.country || process.env.CALENDARIFIC_COUNTRY;

    if (await isHoliday(lwd, country)) {
      return res
        .status(400)
        .json({ error: "Last Working day cannot be on a public holiday" });
    }

    const resignation = await Resignation.create({
      employeeId: userId,
      requestedDate: parsedDate,
      status: "pending",
    });

    return res.status(200).json({
      data: {
        resignation: {
          _id: resignation._id,
        },
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const submitResponses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses))
      return res.status(400).json({ error: "responses must be an array" });

    const resignation = await Resignation.findOne({
      employeeId: userId,
      status: "approved",
    });

    if (!resignation)
      return res
        .status(400)
        .json({ error: "No approved resignation found for this employee" });

    await ExitResponse.findOneAndUpdate(
      {
        employeeId: userId,
      },
      {
        employeeId: userId,
        responses: responses,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(200).json({message: "Responses submitted successfully"})

  } catch (error) {
    console.error("Submit Responses Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { submitResignation, submitResponses };