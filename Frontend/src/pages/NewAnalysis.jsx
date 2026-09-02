
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { uploadResume } from "../services/resume.service";
import { createJobDescription } from "../services/jobDescription.service";
import { createAnalysis } from "../services/analysis.service";

const NewAnalysis = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Resume selected from Resume Library
    const selectedResumeId = searchParams.get("resumeId");

    const [file, setFile] = useState(null);

    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        setError("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
            setFile(null);
            setError("Only PDF files are allowed.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setFile(null);
            setError("Resume must be less than 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // If no resume was selected from library,
        // user must upload a new one.
        if (!selectedResumeId && !file) {
            setError("Please upload your resume.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter the job title.");
            return;
        }

        if (!description.trim()) {
            setError("Please enter the job description.");
            return;
        }

        setLoading(true);

        try {
            let resumeId;

            // --------------------------------
            // 1. Get Resume ID
            // --------------------------------

            if (selectedResumeId) {
                // Existing resume from Resume Library
                resumeId = selectedResumeId;

                console.log(
                    "Using existing resume:",
                    resumeId
                );
            } else {
                // New resume upload
                console.log("Uploading new resume...");

                const resumeData = await uploadResume(file);

                resumeId = resumeData.resume.id;

                console.log(
                    "New Resume ID:",
                    resumeId
                );
            }

            // --------------------------------
            // 2. Create Job Description
            // --------------------------------

            console.log(
                "Creating job description..."
            );

            const jobData = await createJobDescription(
                title,
                company,
                description
            );

            const jobDescriptionId =
                jobData.jobDescription._id;

            console.log(
                "Job Description ID:",
                jobDescriptionId
            );

            // --------------------------------
            // 3. Create AI Analysis
            // --------------------------------

            console.log(
                "Creating AI analysis..."
            );

            const analysisData = await createAnalysis(
                resumeId,
                jobDescriptionId
            );

            console.log(
                "Analysis created:",
                analysisData
            );

            // --------------------------------
            // 4. Open Result Page
            // --------------------------------

            navigate(
                `/analysis/${analysisData.analysis._id}`
            );

        } catch (error) {
            console.error(
                "Analysis creation error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong while creating the analysis."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">

            <div className="mx-auto max-w-4xl">

                {/* Header */}

                <div className="mb-10">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="mb-6 text-sm text-slate-400 hover:text-white"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="text-4xl font-bold">
                        New Resume Analysis
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Upload your resume and compare it
                        against a job description using AI.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* Resume */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="text-xl font-semibold">
                            1. Resume
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Choose an existing resume or
                            upload a new one.
                        </p>

                        {selectedResumeId ? (

                            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                                        📄
                                    </div>

                                    <div>
                                        <p className="font-semibold text-green-400">
                                            Resume selected
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Using your saved resume
                                            from Resume Library.
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/resumes")
                                    }
                                    className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Choose another resume →
                                </button>

                            </div>

                        ) : (

                            <label
                                htmlFor="resume"
                                className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-12 text-center hover:border-blue-500"
                            >

                                <div className="mb-3 text-4xl">
                                    📄
                                </div>

                                {file ? (
                                    <>
                                        <p className="font-medium">
                                            {file.name}
                                        </p>

                                        <p className="mt-2 text-sm text-green-400">
                                            Resume selected
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium">
                                            Click to upload PDF
                                        </p>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Maximum size: 5 MB
                                        </p>
                                    </>
                                )}

                                <input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                            </label>

                        )}

                    </div>

                    {/* Job Details */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h2 className="text-xl font-semibold">
                            2. Job Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Tell us about the job you're applying for.
                        </p>

                        <div className="mt-6 space-y-5">

                            {/* Title */}

                            <div>

                                <label className="mb-2 block text-sm text-slate-300">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. Full Stack Developer"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                            {/* Company */}

                            <div>

                                <label className="mb-2 block text-sm text-slate-300">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) =>
                                        setCompany(e.target.value)
                                    }
                                    placeholder="e.g. Google"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                                />

                            </div>

                            {/* Description */}

                            <div>

                                <label className="mb-2 block text-sm text-slate-300">
                                    Job Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Paste the complete job description here..."
                                    rows={10}
                                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    Include the required skills,
                                    responsibilities and qualifications.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Analyzing Resume with AI..."
                            : "Analyze Resume →"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default NewAnalysis;

