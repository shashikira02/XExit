const express = require("express");
const router = express.Router();

const {
  submitResignation,
  submitResponses,
} = require("../controllers/userController");
const { authMiddleware, requireRole } = require("../utils/auth");

router.post(
  "/resign",
  authMiddleware,
  requireRole("employee"),
  submitResignation
);

router.post(
  "/responses",
  authMiddleware,
  requireRole("employee"),
  submitResponses
);

module.exports = router;
