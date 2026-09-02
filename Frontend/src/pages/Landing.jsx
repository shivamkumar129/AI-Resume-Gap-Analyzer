import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Landing = () => {
    
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold">
          Skill<span className="text-blue-500">Trace</span>
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="rounded-lg px-5 py-2 text-slate-300 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-8 py-24 text-center">
        <div className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          AI-Powered Career Intelligence
        </div>

        <h2 className="mx-auto max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Know exactly what your
          <span className="text-blue-500"> resume is missing.</span>
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Upload your resume, compare it with any job description, and get
          AI-powered ATS scoring, skill-gap analysis, and a personalized
          learning roadmap.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700"
          >
            Analyze My Resume →
          </Link>

          <button className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-300 hover:bg-slate-900">
            See How It Works
          </button>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-left">
            <div className="mb-5 text-3xl">🎯</div>

            <h3 className="text-xl font-semibold">ATS Score</h3>

            <p className="mt-3 text-slate-400">
              Understand how well your resume matches modern applicant tracking
              systems.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-left">
            <div className="mb-5 text-3xl">🧠</div>

            <h3 className="text-xl font-semibold">Skill Gap</h3>

            <p className="mt-3 text-slate-400">
              Discover the exact skills you're missing for your target role.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-left">
            <div className="mb-5 text-3xl">🚀</div>

            <h3 className="text-xl font-semibold">Learning Roadmap</h3>

            <p className="mt-3 text-slate-400">
              Get a personalized roadmap to close your skill gaps and become
              job-ready.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
