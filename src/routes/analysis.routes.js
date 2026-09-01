const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
    createAnalysis,
    getMyAnalyses,
    getAnalysisById
} = require("../controllers/analysis.controller");

const router = express.Router();

router.post(
    "/",
    protect,
    createAnalysis
);

router.get(
    "/",
    protect,
    getMyAnalyses
);
router.get(
    "/:id",
    protect,
    getAnalysisById
);

module.exports = router;