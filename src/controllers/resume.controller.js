const { PDFParse } = require("pdf-parse");

const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF file"
            });
        }

        const parser = new PDFParse({
            data: req.file.buffer
        });

        const pdfData = await parser.getText();

        const extractedText = pdfData.text;

        await parser.destroy();

        const resume = await Resume.create({
           user: req.user.userId,
            originalName: req.file.originalname,
            fileName: req.file.originalname,
            filePath: "",
            extractedText: extractedText
        });

        return res.status(201).json({
            message: "Resume uploaded successfully",
            resume: {
                id: resume._id,
                originalName: resume.originalName,
                extractedText: resume.extractedText
            }
        });

    } catch (error) {

        console.error("Resume processing error:", error);

        return res.status(500).json({
            message: "Failed to process resume"
        });

    }
};
const getMyResumes = async (req, res) => {
    try {

        const resumes = await Resume.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: resumes.length,
            resumes
        });

    } catch (error) {

        console.error("Get resumes error:", error);

        return res.status(500).json({
            message: "Failed to fetch resumes"
        });
    }
};
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            resume
        });

    } catch (error) {
        console.error("Get resume error:", error);

        return res.status(500).json({
            message: "Failed to fetch resume"
        });
    }
};
module.exports = {
    uploadResume,
    getMyResumes,
    getResumeById
};