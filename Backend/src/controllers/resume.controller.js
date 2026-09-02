const mongoose = require("mongoose");
const { PDFParse } = require("pdf-parse");
const Resume = require("../models/Resume");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_LENGTH = 20000;

const uploadResume = async (req, res) => {
  try {
    // 1. Check file exists
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    // 2. Check file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        message: "Resume must be less than 5 MB",
      });
    }

    // 3. Check MIME type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    // 4. Extract PDF text
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    const extractedText = pdfData.text?.trim();

    // 5. Make sure PDF actually contains readable text
    if (!extractedText) {
      return res.status(400).json({
        message:
          "Could not extract text from this PDF. Please upload a text-based resume PDF.",
      });
    }

    // 6. Limit stored text
    const limitedText = extractedText.slice(0, MAX_TEXT_LENGTH);

    // 7. Save resume
    const resume = await Resume.create({
      user: req.user.userId,
      originalName: req.file.originalname,
      fileName: req.file.originalname,
      filePath: "",
      extractedText: limitedText,
    });

    // 8. Do NOT send extracted resume text back to frontend
    return res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        originalName: resume.originalName,
      },
    });
  } catch (error) {
    console.error("Resume processing error:", error);

    return res.status(500).json({
      message: "Failed to process resume",
    });
  }
};


const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.userId,
    })
      .select("-extractedText")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};


const getResumeById = async (req, res) => {
  try {
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};
const deleteResume = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await Resume.deleteOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};


module.exports = {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
};