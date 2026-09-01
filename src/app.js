const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const resumeRoutes = require("./routes/resume.routes");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const jobDescriptionRoutes = require("./routes/jobDescription.routes");
const analysisRoutes = require("./routes/analysis.routes");
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "AI Resume Gap Analyzer API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/test", testRoutes);
app.use("/api/job-descriptions", jobDescriptionRoutes);
app.use("/api/analyses", analysisRoutes);
module.exports = app;