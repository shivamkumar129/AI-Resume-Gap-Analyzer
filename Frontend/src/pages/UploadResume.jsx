
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resume.service";

const UploadResume = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
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
            setError("File size must be less than 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select your resume.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await uploadResume(file);

            console.log("Resume uploaded:", data);

            navigate("/dashboard");
        } catch (error) {
            console.error("Upload error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to upload resume."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">

            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-8">

                    <Link
                        to="/dashboard"
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Analyze Your Resume
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Upload your resume PDF and let AI extract and
                        analyze your professional profile.
                    </p>

                </div>

                {/* Upload Card */}
                <form
                    onSubmit={handleUpload}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
                >

                    <div className="mb-6">

                        <h2 className="text-xl font-semibold">
                            Upload Resume
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            PDF only · Maximum size 5 MB
                        </p>

                    </div>

                    {/* File Upload */}
                    <label
                        htmlFor="resume"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 py-14 text-center transition hover:border-blue-500 hover:bg-slate-950"
                    >

                        <div className="mb-4 text-5xl">
                            📄
                        </div>

                        {file ? (
                            <>
                                <p className="font-medium text-white">
                                    {file.name}
                                </p>

                                <p className="mt-2 text-sm text-green-400">
                                    Ready to upload
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium">
                                    Click to select your resume
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    Upload a PDF file up to 5 MB
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

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Processing Resume..."
                            : "Upload Resume →"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default UploadResume;

