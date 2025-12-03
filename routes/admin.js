const express = require("express");
const router = express.Router();

const {
  viewResignations,
  concludeResignation,
  viewExitResponses,
} = require("../controllers/adminController");

const { authMiddleware, requireRole } = require("../utils/auth");

router.get(
  "/resignations",
  authMiddleware,
  requireRole("admin"),
  viewResignations
);

router.put(
  "/conclude_resignation",
  authMiddleware,
  requireRole("admin"),
  concludeResignation
);

router.get(
  "/exit_responses",
  authMiddleware,
  requireRole("admin"),
  viewExitResponses
);

module.exports = router;
