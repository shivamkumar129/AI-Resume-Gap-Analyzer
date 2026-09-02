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
            mimetype: file.mimetype
        });

        const isPDF = file.originalname
            .toLowerCase()
            .endsWith(".pdf");

        if (isPDF) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

module.exports = upload;