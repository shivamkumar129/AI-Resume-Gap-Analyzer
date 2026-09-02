
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
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
            const data = await register(
                formData.name,
                formData.email,
                formData.password
            );

            console.log("Registered user:", data.user);

            // Redirect to dashboard after successful registration
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed"
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
                        Create your account
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Start analyzing your resume with AI
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

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
                            placeholder="Create a password"
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
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-1 text-blue-400 hover:text-blue-300"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Register;

