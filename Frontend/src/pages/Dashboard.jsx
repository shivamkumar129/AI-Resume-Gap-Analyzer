import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getMyAnalyses, deleteAnalysis } from "../services/analysis.service";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getMyAnalyses();

        console.log("Dashboard analyses:", data);

        setAnalyses(data.analyses || []);
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const totalAnalyses = analyses.length;

  const averageATS =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce(
            (sum, analysis) => sum + (analysis.atsScore || 0),
            0,
          ) / totalAnalyses,
        )
      : null;

  const averageCompatibility =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce(
            (sum, analysis) => sum + (analysis.compatibilityScore || 0),
            0,
          ) / totalAnalyses,
        )
      : null;
  const bestATS =
    totalAnalyses > 0
      ? Math.max(...analyses.map((analysis) => analysis.atsScore || 0))
      : null;

  const handleDeleteAnalysis = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?",
    );

    if (!confirmed) return;

    try {
      await deleteAnalysis(id);

      setAnalyses((prev) => prev.filter((analysis) => analysis._id !== id));
    } catch (error) {
      console.error("Delete analysis error:", error);

      alert(error.response?.data?.message || "Failed to delete analysis.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <nav className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold">
            Resume<span className="text-blue-500">AI</span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-lg border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/10"
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}

        <section className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            YOUR CAREER DASHBOARD
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Analyze your resume against real job descriptions and discover
            exactly what you need to improve.
          </p>
        </section>

        {/* Main CTA */}

        <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              ✨ AI Resume Analysis
            </div>

            <h2 className="text-3xl font-bold md:text-4xl">
              Find the gaps between{" "}
              <span className="text-blue-400">you and your dream job.</span>
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Upload your resume and provide a job description. Our AI will
              evaluate your ATS score, identify missing skills, and create a
              personalized roadmap.
            </p>

            <Link
              to="/analysis/new"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
            >
              Start New Analysis →
            </Link>
            <Link
              to="/resumes"
              className="inline-flex rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
            >
              📄 My Resumes
            </Link>
          </div>

          {/* Decorative score */}

          <div className="absolute -right-10 -top-10 hidden h-64 w-64 rounded-full border border-blue-500/10 bg-blue-500/5 md:block" />

          <div className="absolute right-16 top-20 hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-2xl md:block">
            <p className="text-sm text-slate-400">Your Average ATS</p>

            <p className="mt-2 text-5xl font-bold text-blue-400">
              {averageATS ?? "—"}
            </p>

            <p className="mt-1 text-sm text-green-400">
              {averageATS !== null
                ? "Based on your analyses"
                : "Complete an analysis"}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 md:grid-cols-4">
          {/* Average ATS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Average ATS Score</p>

            <p className="mt-3 text-3xl font-bold">
              {averageATS !== null ? `${averageATS}%` : "—"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {averageATS !== null
                ? "Across all analyses"
                : "Complete an analysis"}
            </p>
          </div>

          {/* Average Compatibility */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Average Job Match</p>

            <p className="mt-3 text-3xl font-bold">
              {averageCompatibility !== null ? `${averageCompatibility}%` : "—"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {averageCompatibility !== null
                ? "Resume compatibility"
                : "No analysis yet"}
            </p>
          </div>

          {/* Total Analyses */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Total Analyses</p>

            <p className="mt-3 text-3xl font-bold">{totalAnalyses}</p>

            <p className="mt-2 text-sm text-slate-500">
              {totalAnalyses === 0
                ? "Start your first analysis"
                : "AI evaluations completed"}
            </p>
          </div>

          {/* Best ATS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Best ATS Score</p>

            <p className="mt-3 text-3xl font-bold">
              {bestATS !== null ? `${bestATS}%` : "—"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {bestATS !== null ? "Your highest score" : "Complete an analysis"}
            </p>
          </div>
        </section>

        {/* Score History */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Score History</h2>
            <p className="mt-1 text-sm text-slate-400">
              Track how your resume performance changes across analyses.
            </p>
          </div>

          {analyses.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...analyses].reverse().map((analysis, index) => ({
                    name: `Analysis ${index + 1}`,
                    ats: analysis.atsScore || 0,
                    match: analysis.compatibilityScore || 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                  <XAxis dataKey="name" stroke="#94a3b8" />

                  <YAxis domain={[0, 100]} stroke="#94a3b8" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="ats"
                    name="ATS Score"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="match"
                    name="Job Match"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-center">
              <div>
                <p className="text-slate-300">No score history yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Complete your first resume analysis to see your progress.
                </p>
              </div>
            </div>
          )}
        </section>
        {/* Recent Analyses */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Recent Analyses</h2>

            <p className="mt-1 text-sm text-slate-400">
              Your latest resume evaluations
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

              <p className="mt-4 text-sm text-slate-400">
                Loading your analyses...
              </p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
                📄
              </div>

              <h3 className="text-lg font-semibold">No analyses yet</h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Upload your resume and compare it with a job description to get
                your first AI-powered analysis.
              </p>

              <Link
                to="/analysis/new"
                className="mt-6 inline-block rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium transition hover:bg-slate-800"
              >
                Analyze Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.slice(0, 5).map((analysis) => (
                <div
                  key={analysis._id}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700 md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {analysis.jobDescription?.title || "Job Analysis"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {analysis.jobDescription?.company ||
                        "Company not specified"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Resume: {analysis.resume?.originalName || "Resume"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">ATS</p>

                      <p className="text-2xl font-bold text-blue-400">
                        {analysis.atsScore}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-slate-500">Match</p>

                      <p className="text-2xl font-bold text-green-400">
                        {analysis.compatibilityScore}%
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/analysis/${analysis._id}`)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteAnalysis(analysis._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
