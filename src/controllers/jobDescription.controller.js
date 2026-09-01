const JobDescription = require("../models/JobDescription");

const createJobDescription = async (req, res) => {
    try {
        const { title, company, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        const jobDescription = await JobDescription.create({
            user: req.user.userId,
            title,
            company,
            description
        });

        return res.status(201).json({
            message: "Job description created successfully",
            jobDescription
        });

    } catch (error) {
        console.error("Create job description error:", error);

        return res.status(500).json({
            message: "Failed to create job description"
        });
    }
};


const getMyJobDescriptions = async (req, res) => {
    try {
        const jobDescriptions = await JobDescription.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: jobDescriptions.length,
            jobDescriptions
        });

    } catch (error) {
        console.error("Get job descriptions error:", error);

        return res.status(500).json({
            message: "Failed to fetch job descriptions"
        });
    }
};


const getJobDescriptionById = async (req, res) => {
    try {
        const jobDescription = await JobDescription.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!jobDescription) {
            return res.status(404).json({
                message: "Job description not found"
            });
        }

        return res.status(200).json({
            jobDescription
        });

    } catch (error) {
        console.error("Get job description error:", error);

        return res.status(500).json({
            message: "Failed to fetch job description"
        });
    }
};


module.exports = {
    createJobDescription,
    getMyJobDescriptions,
    getJobDescriptionById
};