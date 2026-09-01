const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const Analysis = require("../models/Analysis");
const { analyzeResume } = require("../services/ai.service");
const createAnalysis = async (req, res) => {
    try {
        const { resumeId, jobDescriptionId } = req.body;

        // 1. Validate IDs
        if (!resumeId || !jobDescriptionId) {
            return res.status(400).json({
                message: "Resume ID and Job Description ID are required"
            });
        }

        // 2. Find user's resume
        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.user.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        // 3. Find user's job description
        const jobDescription = await JobDescription.findOne({
            _id: jobDescriptionId,
            user: req.user.userId
        });

        if (!jobDescription) {
            return res.status(404).json({
                message: "Job description not found"
            });
        }

        // 4. Temporary mock AI result
        const analysisResult = await analyzeResume(
    resume.extractedText,
    jobDescription.description
);

        // 5. Save analysis
        const analysis = await Analysis.create({
            user: req.user.userId,
            resume: resume._id,
            jobDescription: jobDescription._id,

            ...analysisResult,

            aiResponse: analysisResult
        });

        // 6. Response
        return res.status(201).json({
            message: "Analysis created successfully",
            analysis
        });

    } catch (error) {
        console.error("Create analysis error:", error);

        return res.status(500).json({
            message: "Failed to create analysis"
        });
    }
};
const getMyAnalyses = async (req, res) => {
    try {
        const analyses = await Analysis.find({
            user: req.user.userId
        })
            .populate("resume", "originalName")
            .populate("jobDescription", "title company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: analyses.length,
            analyses
        });

    } catch (error) {
        console.error("Get analyses error:", error);

        return res.status(500).json({
            message: "Failed to fetch analyses"
        });
    }
};
const getAnalysisById = async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            _id: req.params.id,
            user: req.user.userId
        })
            .populate("resume")
            .populate("jobDescription");

        if (!analysis) {
            return res.status(404).json({
                message: "Analysis not found"
            });
        }

        return res.status(200).json({
            analysis
        });

    } catch (error) {
        console.error("Get analysis error:", error);

        return res.status(500).json({
            message: "Failed to fetch analysis"
        });
    }
};

module.exports = {
    createAnalysis,
    getMyAnalyses,
    getAnalysisById
};