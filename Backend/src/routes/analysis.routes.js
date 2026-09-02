const express = require("express");
const { generateAnalysisPDF } = require("../services/pdf.service");
const protect = require("../middleware/auth.middleware");

const {
  createAnalysis,
  getMyAnalyses,
  getAnalysisById,
  deleteAnalysis
} = require("../controllers/analysis.controller");

const router = express.Router();

router.post(
    "/",
    protect,
    createAnalysis
);

router.get(
    "/",
    protect,
    getMyAnalyses
);
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const Analysis = require("../models/Analysis");

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.userId,
    })
      .populate("resume")
      .populate("jobDescription");

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    generateAnalysisPDF(analysis, res);
  } catch (error) {
    console.error("Generate PDF error:", error);

    return res.status(500).json({
      message: "Failed to generate PDF report",
    });
  }
});
router.get(
    "/:id",
    protect,
    getAnalysisById
);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;