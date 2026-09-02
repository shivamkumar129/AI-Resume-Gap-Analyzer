import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadResume from "./pages/UploadResume";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisResult from "./pages/AnalysisResult";
import ResumeLibrary from "./pages/ResumeLibrary";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Normal authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/analysis/new" element={<NewAnalysis />} />
          <Route
            path="/analysis/:id"
            element={<AnalysisResult />}
          />
          <Route
            path="/resumes"
            element={<ResumeLibrary />}
          />
        </Route>

        {/* Admin-only route */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;