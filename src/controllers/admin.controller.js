const User = require("../models/User");
const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");

const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();

    const scoreStats = await Analysis.aggregate([
      {
        $group: {
          _id: null,
          averageATS: { $avg: "$atsScore" },
          averageCompatibility: { $avg: "$compatibilityScore" },
        },
      },
    ]);

    const averageATS = scoreStats.length
      ? Math.round(scoreStats[0].averageATS || 0)
      : 0;

    const averageCompatibility = scoreStats.length
      ? Math.round(scoreStats[0].averageCompatibility || 0)
      : 0;

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);
    const scoreHistory = await Analysis.find()
      .select("atsScore compatibilityScore createdAt")
      .sort({ createdAt: 1 })
      .limit(20);

      const recentAnalyses = await Analysis.find()
  .populate("user", "name email")
  .select("user atsScore compatibilityScore createdAt")
  .sort({ createdAt: -1 })
  .limit(10);
    return res.status(200).json({
  stats: {
    totalUsers,
    totalResumes,
    totalAnalyses,
    averageATS,
    averageCompatibility,
  },
  recentUsers,
  scoreHistory,
  recentAnalyses,
});
  } catch (error) {
    console.error("Admin analytics error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin analytics",
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const search = req.query.search?.trim() || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  getAdminAnalytics,
  getAllUsers
};
