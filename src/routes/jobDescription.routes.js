const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
    createJobDescription,
    getMyJobDescriptions,
    getJobDescriptionById
} = require("../controllers/jobDescription.controller");

const router = express.Router();

router.post(
    "/",
    protect,
    createJobDescription
);

router.get(
    "/",
    protect,
    getMyJobDescriptions
);

router.get(
    "/:id",
    protect,
    getJobDescriptionById
);

module.exports = router;