const mongoose = require("mongoose");

const jobDescriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
            default: "",
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const JobDescription = mongoose.model(
    "JobDescription",
    jobDescriptionSchema
);

module.exports = JobDescription;