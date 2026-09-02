
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await login(
                formData.email,
                formData.password
            );

            console.log("Logged in user:", data.user);

            // Redirect to dashboard after successful login
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Login to continue analyzing your resume
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                            {success}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="ml-1 text-blue-400 hover:text-blue-300"
                    >
                        Create one
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;

