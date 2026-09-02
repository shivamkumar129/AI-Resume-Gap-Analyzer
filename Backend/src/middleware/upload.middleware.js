const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        console.log("Uploaded file:", {
            name: file.originalname,
            mimetype: file.mimetype,
        });

        const isPDF =
            file.mimetype === "application/pdf" ||
            file.mimetype === "application/octet-stream";

        const hasPDFExtension = file.originalname
            .toLowerCase()
            .endsWith(".pdf");

        if (isPDF && hasPDFExtension) {
            return cb(null, true);
        }

        return cb(new Error("Only PDF files are allowed"));
    },
});

module.exports = upload;