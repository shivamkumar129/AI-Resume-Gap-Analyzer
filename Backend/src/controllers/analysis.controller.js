const mongoose = require("mongoose");

const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");
const { analyzeResume } = require("../services/ai.service");

const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;

    // Validate required fields
    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        message: "Resume ID and Job Description ID are required",
      });
    }

    // Validate MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(resumeId) ||
      !mongoose.Types.ObjectId.isValid(jobDescriptionId)
    ) {
      return res.status(400).json({
        message: "Invalid resume or job description ID",
      });
    }

    // Find user's resume
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // Make sure extracted text exists
    if (!resume.extractedText || !resume.extractedText.trim()) {
      return res.status(400).json({
        message: "Resume text could not be extracted",
      });
    }

    // Find user's job description
    const jobDescription = await JobDescription.findOne({
      _id: jobDescriptionId,
      user: req.user.userId,
    });

    if (!jobDescription) {
      return res.status(404).json({
        message: "Job description not found",
      });
    }

    if (!jobDescription.description?.trim()) {
      return res.status(400).json({
        message: "Job description is empty",
      });
    }

    // Prevent excessively large AI requests
    const MAX_RESUME_LENGTH = 20000;
    const MAX_JD_LENGTH = 15000;

    const resumeText = resume.extractedText.slice(0, MAX_RESUME_LENGTH);
    const jdText = jobDescription.description.slice(0, MAX_JD_LENGTH);

    console.log("Starting AI resume analysis...");

    // Call Gemini AI
    const analysisResult = await analyzeResume(
      resumeText,
      jdText
    );

    console.log("AI analysis completed successfully");

    // Save analysis
    const analysis = await Analysis.create({
      user: req.user.userId,
      resume: resume._id,
      jobDescription: jobDescription._id,

      ...analysisResult,

      aiResponse: analysisResult,
    });

    return res.status(201).json({
      message: "Analysis created successfully",
      analysis,
    });

  } catch (error) {
    console.error("Create analysis error:", error);

    // Gemini/API related errors
    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate") ||
      error.message?.includes("429")
    ) {
      return res.status(429).json({
        message: "AI usage limit reached. Please try again later.",
      });
    }

    // AI returned invalid output
    if (error.message?.includes("invalid JSON")) {
      return res.status(502).json({
        message: "AI returned an invalid analysis. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Failed to create analysis",
    });
  }
};


const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({
      user: req.user.userId,
    })
      .populate("resume", "originalName")
      .populate("jobDescription", "title company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: analyses.length,
      analyses,
    });

  } catch (error) {
    console.error("Get analyses error:", error);

    return res.status(500).json({
      message: "Failed to fetch analyses",
    });
  }
};


const getAnalysisById = async (req, res) => {
  try {

    // Validate ID before querying MongoDB
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

    return res.status(200).json({
      analysis,
    });

  } catch (error) {
    console.error("Get analysis error:", error);

    return res.status(500).json({
      message: "Failed to fetch analysis",
    });
  }
};
const deleteAnalysis = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    await Analysis.deleteOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    return res.status(200).json({
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error);

    return res.status(500).json({
      message: "Failed to delete analysis",
    });
  }
};

module.exports = {
  createAnalysis,
  getMyAnalyses,
  getAnalysisById,
  deleteAnalysis
};