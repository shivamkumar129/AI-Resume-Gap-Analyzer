import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  uploadResume,
  getMyResumes,
  deleteResume,
} from "../services/resume.service";

const ResumeLibrary = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleDeleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    try {
      await deleteResume(id);

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (error) {
      console.error("Delete resume error:", error);

      alert(error.response?.data?.message || "Failed to delete resume.");
    }
  };
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getMyResumes();

        console.log("My resumes:", data);

        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);

        setError(error.response?.data?.message || "Failed to load resumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}

      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/dashboard" className="text-2xl font-bold">
            Resume<span className="text-blue-500">AI</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}

        <div className="mb-10">
          <p className="text-sm font-medium text-blue-400">YOUR RESUMES</p>

          <h1 className="mt-2 text-4xl font-bold">Resume Library</h1>

          <p className="mt-3 text-slate-400">
            Manage your uploaded resumes and use them for future AI analyses.
          </p>
        </div>

        {/* Upload button */}

        <div className="mb-8">
          <Link
            to="/analysis/new"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
          >
            + Upload New Resume
          </Link>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading your resumes...
            </p>
          </div>
        )}

        {/* Empty state */}

        {!loading && resumes.length === 0 && !error && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-3xl">
              📄
            </div>

            <h2 className="mt-5 text-xl font-semibold">No resumes yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Upload your first resume to start analyzing your compatibility
              with jobs.
            </p>

            <Link
              to="/analysis/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
            >
              Upload Resume
            </Link>
          </div>
        )}

        {/* Resume cards */}

        {!loading && resumes.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                    📄
                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    PDF
                  </span>
                </div>

                <h2 className="mt-5 truncate text-lg font-semibold">
                  {resume.originalName || resume.fileName || "Untitled Resume"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Uploaded{" "}
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : "Recently"}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    to={`/analysis/new?resumeId=${resume._id}`}
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Use for Analysis →
                  </Link>

                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeLibrary;
