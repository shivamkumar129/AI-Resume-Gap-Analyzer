
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { downloadAnalysisPDF } from "../services/pdf.service";
import { getAnalysisById } from "../services/analysis.service";

/* -----------------------------------------
   Score Ring
----------------------------------------- */

const ScoreCircle = ({ score, label }) => {
    const safeScore = Math.max(
        0,
        Math.min(100, Number(score) || 0)
    );

    const getColor = () => {
        if (safeScore >= 80) return "text-green-400";
        if (safeScore >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    const getBackground = () => {
        if (safeScore >= 80) return "bg-green-500/10";
        if (safeScore >= 60) return "bg-yellow-500/10";
        return "bg-red-500/10";
    };

    const getLabel = () => {
        if (safeScore >= 80) return "Excellent";
        if (safeScore >= 60) return "Good";
        if (safeScore >= 40) return "Needs Improvement";
        return "Poor";
    };

    return (
        <div className="flex flex-col items-center">

            <div
                className={`relative flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-slate-800 ${getColor()}`}
            >
                <div
                    className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-current border-r-current"
                    style={{
                        transform: `rotate(${45 + safeScore * 1.8}deg)`,
                    }}
                />

                <div
                    className={`flex h-32 w-32 flex-col items-center justify-center rounded-full ${getBackground()}`}
                >
                    <span className={`text-4xl font-bold ${getColor()}`}>
                        {safeScore}
                    </span>

                    <span className="text-xs text-slate-500">
                        / 100
                    </span>
                </div>
            </div>

            <h3 className="mt-5 text-lg font-semibold">
                {label}
            </h3>

            <span
                className={`mt-1 text-sm font-medium ${getColor()}`}
            >
                {getLabel()}
            </span>
        </div>
    );
};


/* -----------------------------------------
   Skill List
----------------------------------------- */

const SkillList = ({ title, skills, type }) => {

    const isMatched = type === "matched";

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isMatched
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                    }`}
                >
                    {skills?.length || 0}
                </span>

            </div>

            {skills?.length > 0 ? (

                <div className="mt-5 flex flex-wrap gap-3">

                    {skills.map((skill, index) => (

                        <span
                            key={index}
                            className={`rounded-full border px-4 py-2 text-sm font-medium ${
                                isMatched
                                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                                    : "border-red-500/20 bg-red-500/10 text-red-400"
                            }`}
                        >
                            {isMatched ? "✓ " : "✕ "}
                            {skill}
                        </span>

                    ))}

                </div>

            ) : (

                <p className="mt-5 text-sm text-slate-500">
                    No skills found.
                </p>

            )}

        </div>
    );
};


/* -----------------------------------------
   Insight Card
----------------------------------------- */

const InsightCard = ({ icon, title, value, description }) => {

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">

            <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xl">
                    {icon}
                </div>

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

            </div>

        </div>
    );
};


/* -----------------------------------------
   Priority Section
----------------------------------------- */

const PrioritySection = ({ missingSkills }) => {

    if (!missingSkills?.length) {
        return (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

                <h2 className="text-xl font-bold text-green-400">
                    🎉 No Major Skill Gaps Detected
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    Your resume appears to cover the important skills
                    identified in the job description. Focus on improving
                    your experience descriptions and measurable achievements.
                </p>

            </div>
        );
    }

    const priorities = missingSkills.slice(0, 3);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">

                <p className="text-sm font-medium text-blue-400">
                    WHAT TO FIX FIRST
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                    Your Top Priorities
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    Start with these skills to make the biggest improvement
                    to your job compatibility.
                </p>

            </div>

            <div className="space-y-4">

                {priorities.map((skill, index) => (

                    <div
                        key={index}
                        className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-400">
                            {index + 1}
                        </div>

                        <div className="flex-1">

                            <p className="font-semibold">
                                {skill}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Important skill identified from the job
                                requirements.
                            </p>

                        </div>

                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Gap
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
};


/* -----------------------------------------
   Strength / Weakness
----------------------------------------- */

const BulletList = ({ title, icon, items, type }) => {

    const isStrength = type === "strength";

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

                <span className="text-xl">
                    {icon}
                </span>

                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

            </div>

            {items?.length > 0 ? (

                <div className="mt-5 space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className={`rounded-xl border p-4 text-sm leading-6 ${
                                isStrength
                                    ? "border-green-500/10 bg-green-500/5 text-slate-300"
                                    : "border-yellow-500/10 bg-yellow-500/5 text-slate-300"
                            }`}
                        >
                            <span
                                className={
                                    isStrength
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                }
                            >
                                {isStrength ? "✓" : "!"}
                            </span>{" "}
                            {item}
                        </div>

                    ))}

                </div>

            ) : (

                <p className="mt-5 text-sm text-slate-500">
                    No information available.
                </p>

            )}

        </div>
    );
};


/* -----------------------------------------
   Roadmap
----------------------------------------- */

const Roadmap = ({ roadmap }) => {

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-8">

                <p className="text-sm font-medium text-blue-400">
                    PERSONALIZED PLAN
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                    🚀 Your Learning Roadmap
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Follow these recommendations in priority order to
                    close your biggest skill gaps.
                </p>

            </div>

            {roadmap?.length > 0 ? (

                <div className="relative space-y-6">

                    <div className="absolute bottom-5 left-5 top-5 hidden w-px bg-slate-800 md:block" />

                    {roadmap.map((item, index) => {

                        const priority =
                            item.priority || "Medium";

                        const priorityClass =
                            priority === "High"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : priority === "Medium"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20";

                        return (

                            <div
                                key={index}
                                className="relative flex flex-col gap-4 md:flex-row md:gap-6"
                            >

                                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-slate-950 font-bold text-blue-400">
                                    {index + 1}
                                </div>

                                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-5">

                                    <div className="flex flex-col justify-between gap-3 md:flex-row">

                                        <div>

                                            <h3 className="text-lg font-semibold">
                                                {item.skill}
                                            </h3>

                                            {item.reason && (
                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                    {item.reason}
                                                </p>
                                            )}

                                        </div>

                                        <span
                                            className={`h-fit w-fit rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass}`}
                                        >
                                            {priority} Priority
                                        </span>

                                    </div>

                                    {item.resources?.length > 0 && (

                                        <div className="mt-5">

                                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Recommended Resources
                                            </p>

                                            <div className="space-y-2">

                                                {item.resources.map(
                                                    (resource, resourceIndex) => {

                                                        const isUrl =
                                                            /^https?:\/\//i.test(
                                                                resource
                                                            );

                                                        return (

                                                            <div
                                                                key={
                                                                    resourceIndex
                                                                }
                                                                className="text-sm"
                                                            >

                                                                {isUrl ? (

                                                                    <a
                                                                        href={
                                                                            resource
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-blue-400 transition hover:text-blue-300 hover:underline"
                                                                    >
                                                                        ↗{" "}
                                                                        {resource}
                                                                    </a>

                                                                ) : (

                                                                    <span className="text-slate-400">
                                                                        •{" "}
                                                                        {
                                                                            resource
                                                                        }
                                                                    </span>

                                                                )}

                                                            </div>

                                                        );
                                                    }
                                                )}

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </div>

                        );
                    })}

                </div>

            ) : (

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-8 text-center">

                    <p className="text-slate-500">
                        No roadmap available.
                    </p>

                </div>

            )}

        </div>
    );
};


/* -----------------------------------------
   Main Component
----------------------------------------- */

const AnalysisResult = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchAnalysis = async () => {

            try {

                const data = await getAnalysisById(id);

                console.log("Analysis:", data);

                setAnalysis(data.analysis);

            } catch (error) {

                console.error(
                    "Failed to fetch analysis:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load analysis."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchAnalysis();

    }, [id]);


    /* Loading */

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />

                    <p className="mt-5 text-sm text-slate-400">
                        AI is preparing your analysis...
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                        This may take a few seconds.
                    </p>

                </div>

            </div>

        );
    }


    /* Error */

    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

                <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                        ⚠️
                    </div>

                    <h2 className="mt-5 text-xl font-bold">
                        Unable to load analysis
                    </h2>

                    <p className="mt-2 text-sm text-red-400">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );
    }


    if (!analysis) {
        return null;
    }


    /* Calculations */

    const atsScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(analysis.atsScore) || 0
            )
        );

    const compatibilityScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(analysis.compatibilityScore) || 0
            )
        );

    const matchedCount =
        analysis.matchedSkills?.length || 0;

    const missingCount =
        analysis.missingSkills?.length || 0;

    const totalSkills =
        matchedCount + missingCount;

    const skillCoverage =
        totalSkills > 0
            ? Math.round(
                  (matchedCount / totalSkills) * 100
              )
            : 0;


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}

            <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="text-xl font-bold"
                    >
                        Resume<span className="text-blue-500">
                            AI
                        </span>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Dashboard
                    </button>

                </div>

            </nav>


            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Header */}

                <section className="mb-10">

                    <p className="text-sm font-medium tracking-wider text-blue-400">
                        AI ANALYSIS REPORT
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <h1 className="text-4xl font-bold md:text-5xl">
                                Resume Analysis
                            </h1>

                            <p className="mt-3 max-w-2xl text-slate-400">
                                Understand how well your resume matches
                                the position and exactly what you can
                                improve.
                            </p>

                        </div>

                        <div className="text-sm text-slate-500">
                            Generated by AI
                        </div>

                    </div>

                </section>


                {/* Job Information */}

                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                Resume
                            </p>

                            <h2 className="mt-2 truncate text-lg font-semibold">
                                {analysis.resume?.originalName ||
                                    "Resume"}
                            </h2>

                        </div>

                        <div className="md:text-right">

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                Target Position
                            </p>

                            <h2 className="mt-2 text-lg font-semibold">
                                {analysis.jobDescription?.title ||
                                    "Job"}
                            </h2>

                            {analysis.jobDescription?.company && (

                                <p className="mt-1 text-sm text-slate-400">
                                    {analysis.jobDescription.company}
                                </p>

                            )}

                        </div>

                    </div>

                </section>


                {/* Score Section */}

                <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">

                    <div className="mb-8">

                        <p className="text-sm font-medium text-blue-400">
                            PERFORMANCE OVERVIEW
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            How competitive is your resume?
                        </h2>

                    </div>

                    <div className="flex flex-col items-center justify-center gap-16 md:flex-row">

                        <ScoreCircle
                            score={atsScore}
                            label="ATS Score"
                        />

                        <ScoreCircle
                            score={compatibilityScore}
                            label="Job Compatibility"
                        />

                    </div>

                </section>


                {/* Quick Insights */}

                <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <InsightCard
                        icon="🎯"
                        title="ATS Score"
                        value={`${atsScore}%`}
                        description="Resume screening strength"
                    />

                    <InsightCard
                        icon="💼"
                        title="Job Match"
                        value={`${compatibilityScore}%`}
                        description="Compatibility with target role"
                    />

                    <InsightCard
                        icon="✓"
                        title="Matched Skills"
                        value={matchedCount}
                        description="Relevant skills found"
                    />

                    <InsightCard
                        icon="⚠"
                        title="Skill Gaps"
                        value={missingCount}
                        description="Important skills to improve"
                    />

                </section>


                {/* Skill Coverage */}

                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex flex-col justify-between gap-3 sm:flex-row">

                        <div>

                            <h2 className="text-xl font-semibold">
                                Skill Coverage
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Percentage of identified job skills
                                currently covered by your resume.
                            </p>

                        </div>

                        <p className="text-2xl font-bold text-blue-400">
                            {skillCoverage}%
                        </p>

                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

                        <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-700"
                            style={{
                                width: `${skillCoverage}%`,
                            }}
                        />

                    </div>

                    <div className="mt-3 flex justify-between text-xs text-slate-500">

                        <span>
                            {matchedCount} matched
                        </span>

                        <span>
                            {missingCount} missing
                        </span>

                    </div>

                </section>


                {/* Priority */}

                <div className="mb-8">

                    <PrioritySection
                        missingSkills={
                            analysis.missingSkills
                        }
                    />

                </div>


                {/* Resume Summary */}

                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <p className="text-sm font-medium text-blue-400">
                        AI INSIGHT
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                        Resume Summary
                    </h2>

                    <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">
                        {analysis.resumeSummary ||
                            "No summary available."}
                    </p>

                </section>


                {/* Skills */}

                <section className="mb-8 grid gap-6 md:grid-cols-2">

                    <SkillList
                        title="✓ Matched Skills"
                        skills={analysis.matchedSkills}
                        type="matched"
                    />

                    <SkillList
                        title="✕ Missing Skills"
                        skills={analysis.missingSkills}
                        type="missing"
                    />

                </section>


                {/* Strengths / Weaknesses */}

                <section className="mb-8 grid gap-6 md:grid-cols-2">

                    <BulletList
                        title="Strengths"
                        icon="💪"
                        items={analysis.strengths}
                        type="strength"
                    />

                    <BulletList
                        title="Areas to Improve"
                        icon="⚠️"
                        items={analysis.weaknesses}
                        type="weakness"
                    />

                </section>
                   {/* Improvement Actions */}
<section className="mt-8">
  <div className="mb-5">
    <h2 className="text-2xl font-bold text-white">
      Top Actions to Improve Your Score
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Focus on these actions to make your resume stronger for this specific job.
    </p>
  </div>

  {analysis.improvementActions?.length > 0 ? (
    <div className="space-y-4">
      {analysis.improvementActions.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                {index + 1}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {item.action}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.reason}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                item.impact === "High"
                  ? "bg-red-500/10 text-red-400"
                  : item.impact === "Medium"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-green-500/10 text-green-400"
              }`}
            >
              {item.impact} Impact
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
      No improvement actions available for this analysis.
    </div>
  )}
</section>
{/* Resume Improvements */}
<section className="mt-8">
  <div className="mb-5">
    <h2 className="text-2xl font-bold text-white">
      Resume Improvement Suggestions
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Specific changes you can make to strengthen your resume for this job.
    </p>
  </div>

  {analysis.resumeImprovements?.length > 0 ? (
    <div className="space-y-4">
      {analysis.resumeImprovements.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-white">
                  {item.section}
                </h3>

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                  Resume Section
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Issue
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {item.issue}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  How to Improve
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {item.suggestion}
                </p>
              </div>

              {item.example && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Suggested Example
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.example}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
      No specific resume improvements available for this analysis.
    </div>
  )}
</section>
                {/* Roadmap */}

                <section className="mb-8">

                    <Roadmap
                        roadmap={analysis.roadmap}
                    />

                </section>


                {/* CTA */}

                <section className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-slate-900 p-8 text-center">

                    <h2 className="text-2xl font-bold">
                        Ready to improve your resume?
                    </h2>

                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        Apply the recommendations above and run another
                        analysis to track your progress.
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

                        <button
                            onClick={() =>
                                navigate("/analysis/new")
                            }
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
                        >
                            Analyze Another Resume →
                        </button>

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
                        >
                            Back to Dashboard
                        </button>
                      <button
  onClick={() => downloadAnalysisPDF(analysis._id)}
  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
>
  Download PDF Report
</button>
                    </div>

                </section>

            </main>

        </div>
    );
};

export default AnalysisResult;

