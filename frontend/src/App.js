import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserSignup from "./pages/Signup";
import UserLogin from "./pages/Login";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageEvents from "./components/admin/ManageEvents";
import AddEvent from "./components/admin/AddEvent";

function App() {
  const userRole = localStorage.getItem("role"); // Get role from localStorage

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Common Route */}
          <Route path="/" element={<Home />} />

          {/* User Routes */}
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {userRole === "user" && <Route path="/profile" element={<Profile />} />}
          {userRole === "user" && <Route path="/events" element={<Events />} />}

          {/* Admin Routes */}
          {userRole === "admin" && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
          {userRole === "admin" && <Route path="/admin/manage-events" element={<ManageEvents />} />}
          {userRole === "admin" && <Route path="/admin/add-event" element={<AddEvent />} />}

          {/* Redirect if no role */}
          {!userRole && <Route path="*" element={<Navigate to="/login" />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

