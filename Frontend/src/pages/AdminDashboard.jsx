import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:3000/api/admin/analytics";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState({});
const [usersLoading, setUsersLoading] = useState(false);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(API_URL, {
          withCredentials: true,
        });

        setData(response.data);
      } catch (error) {
        console.error("Admin analytics error:", error);

        setError(
          error.response?.data?.message || "Failed to load admin analytics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
const fetchUsers = async () => {
  try {
    setUsersLoading(true);

    const response = await axios.get(
      "http://localhost:3000/api/admin/users",
      {
        params: {
          page,
          limit: 10,
          search,
        },
        withCredentials: true,
      }
    );

    setUsers(response.data.users);
    setPagination(response.data.pagination);
  } catch (error) {
    console.error("Users fetch error:", error);
  } finally {
    setUsersLoading(false);
  }
};
useEffect(() => {
  fetchUsers();
}, [page, search]);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-400">Administration</p>

          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>

          <p className="mt-2 text-slate-400">
            Monitor platform usage and resume analysis performance.
          </p>
        </div>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-3 text-3xl font-bold">{stats.totalUsers ?? 0}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Total Resumes</p>
            <p className="mt-3 text-3xl font-bold">{stats.totalResumes ?? 0}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Total Analyses</p>
            <p className="mt-3 text-3xl font-bold">
              {stats.totalAnalyses ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Average ATS</p>
            <p className="mt-3 text-3xl font-bold">{stats.averageATS ?? 0}%</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Average Job Match</p>
            <p className="mt-3 text-3xl font-bold">
              {stats.averageCompatibility ?? 0}%
            </p>
          </div>
        </section>
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Platform Score Trends</h2>

            <p className="mt-1 text-sm text-slate-400">
              ATS and job compatibility scores across recent analyses.
            </p>
          </div>

          {data?.scoreHistory?.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.scoreHistory.map((analysis, index) => ({
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

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="ats"
                    name="ATS Score"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="match"
                    name="Job Match"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center text-slate-500">
              No analysis data available yet.
            </div>
          )}
        </section>
        {/* Recent Users */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-bold">Recent Users</h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest users registered on the platform.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-800 text-sm text-slate-500">
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Joined</th>
                </tr>
              </thead>

              <tbody>
                {data?.recentUsers?.map((user) => (
                  <tr key={user._id} className="border-b border-slate-800/70">
                    <td className="py-4 font-medium text-white">{user.name}</td>

                    <td className="py-4 text-sm text-slate-400">
                      {user.email}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {!data?.recentUsers?.length && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* User Management */}
<section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-bold">User Management</h2>

      <p className="mt-1 text-sm text-slate-400">
        Search and manage registered users.
      </p>
    </div>

    <input
      type="text"
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 sm:w-72"
    />
  </div>

  <div className="mt-6 overflow-x-auto">
    {usersLoading ? (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading users...
        </p>
      </div>
    ) : (
      <table className="w-full min-w-[700px] text-left">
        <thead>
          <tr className="border-b border-slate-800 text-sm text-slate-500">
            <th className="pb-4 font-medium">Name</th>
            <th className="pb-4 font-medium">Email</th>
            <th className="pb-4 font-medium">Role</th>
            <th className="pb-4 font-medium">Joined</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-slate-800/70"
              >
                <td className="py-4 font-medium text-white">
                  {user.name}
                </td>

                <td className="py-4 text-sm text-slate-400">
                  {user.email}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="py-4 text-sm text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="py-10 text-center text-sm text-slate-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>

  {/* Pagination */}
  <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
    <p className="text-sm text-slate-500">
      Page {pagination.page || 1} of{" "}
      {pagination.totalPages || 1}
    </p>

    <div className="flex gap-3">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page <= 1 || usersLoading}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <button
        onClick={() =>
          setPage((prev) =>
            Math.min(prev + 1, pagination.totalPages || 1)
          )
        }
        disabled={
          page >= (pagination.totalPages || 1) || usersLoading
        }
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
</section>
{/* Recent Analysis Activity */}
<section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
  <div>
    <h2 className="text-xl font-bold">
      Recent Analysis Activity
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Latest resume analyses performed on the platform.
    </p>
  </div>

  <div className="mt-6 overflow-x-auto">
    <table className="w-full min-w-[700px] text-left">
      <thead>
        <tr className="border-b border-slate-800 text-sm text-slate-500">
          <th className="pb-4 font-medium">User</th>
          <th className="pb-4 font-medium">Email</th>
          <th className="pb-4 font-medium">ATS Score</th>
          <th className="pb-4 font-medium">Job Match</th>
          <th className="pb-4 font-medium">Date</th>
        </tr>
      </thead>

      <tbody>
        {data?.recentAnalyses?.length > 0 ? (
          data.recentAnalyses.map((analysis) => (
            <tr
              key={analysis._id}
              className="border-b border-slate-800/70"
            >
              <td className="py-4 font-medium text-white">
                {analysis.user?.name || "Unknown User"}
              </td>

              <td className="py-4 text-sm text-slate-400">
                {analysis.user?.email || "N/A"}
              </td>

              <td className="py-4">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                  {analysis.atsScore ?? 0}%
                </span>
              </td>

              <td className="py-4">
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  {analysis.compatibilityScore ?? 0}%
                </span>
              </td>

              <td className="py-4 text-sm text-slate-400">
                {new Date(
                  analysis.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              className="py-10 text-center text-sm text-slate-500"
            >
              No analysis activity yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>
      </main>
    </div>
  );
};

export default AdminDashboard;
