const express = require("express");

const protect = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
    getAdminAnalytics,
    getAllUsers
} = require("../controllers/admin.controller");

const router = express.Router();

router.get(
    "/analytics",
    protect,
    adminMiddleware,
    getAdminAnalytics
);

router.get(
  "/users",
  protect,
  adminMiddleware,
  getAllUsers
);

module.exports = router;