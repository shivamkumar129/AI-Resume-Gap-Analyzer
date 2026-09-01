const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true,
        },

        jobDescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobDescription",
            required: true,
        },

        atsScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        compatibilityScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        matchedSkills: {
            type: [String],
            default: [],
        },

        missingSkills: {
            type: [String],
            default: [],
        },

        resumeSummary: {
            type: String,
            default: "",
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        roadmap: {
            type: [
                {
                    skill: String,
                    reason: String,
                    resources: [String],
                    priority: {
                        type: String,
                        enum: ["High", "Medium", "Low"],
                    },
                },
            ],
            default: [],
        },

        aiResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

module.exports = Analysis;