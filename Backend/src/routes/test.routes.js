const express = require("express");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
    res.status(200).json({
        message: "You accessed a protected route",
        user: req.user
    });
});

module.exports = router;