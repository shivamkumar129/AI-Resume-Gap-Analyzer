const express = require("express");

const upload = require("../middleware/upload.middleware");

const {
    uploadResume,
    getMyResumes,
    getResumeById
} = require("../controllers/resume.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);
router.get(
    "/",
    authMiddleware,
    getMyResumes
);
router.get(
    '/:id',
    authMiddleware,
    getResumeById);
module.exports = router;