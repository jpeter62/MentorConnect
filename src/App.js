import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/AdminDashboard";
import LoginPage from "./components/LoginRegister/LoginPage";
import StudentRegistration from "./components/LoginRegister/StudentRegistration";
import TeacherRegistration from "./components/LoginRegister/TeacherRegistration";
import StudentHome from "./components/HomePages/StudentHome";
import Sessions from "./components/HomePages/Sessions";
import BookSession from "./components/HomePages/BookSession";
import MentorDashboard from "./components/mentor/MentorDashboard";
import MentorMessages from "./components/mentor/MentorMessages";
import MentorSettings from "./components/mentor/MentorSettings";
import ScheduleManagement from "./components/mentor/ScheduleManagement";
import SessionRequests from "./components/mentor/SessionRequests";
import FeedbackRating from "./components/mentor/FeedbackRating";
import Feedback from "./components/HomePages/Feedback";
import StudentSettings from "./components/HomePages/StudentSettings";
import FindMentors from "./components/HomePages/FindMentors";
import Messages from "./components/HomePages/Messages";
import LogoutPage from "./components/LoginRegister/LogoutPage";

import Header from "./common/Header"; // Import the common header
import Footer from "./common/Footer"; // Import the common footer

// App Component
function App() {
  const location = useLocation(); // Access current location

  // Paths where Header and Footer should be excluded
  const excludedPaths = [
    "/student-home",
    "/sessions",
    "/feedback",
    "/find-mentors",
    "/messages",
    "/mentor-dashboard",
    "/schedule-management",
    "/session-requests",
    "/feedback-rating",
    "/mentor-messages",
    "/mentor-settings",
    "/student-settings",
    "/admin",
    "/forgot-password",
    "/booksession",
    
  ];

  // Check if the current path matches any excluded path or patterns
  const isExcludedPath =
    excludedPaths.includes(location.pathname) ||
    /\/reset-password\/.+/.test(location.pathname);

  return (
    <div className="app-wrapper">
      {/* Render Header if not on excluded pages */}
      {!isExcludedPath && <Header />}
      
      {/* Application Routes */}
      <main className="main-container">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student-register" element={<StudentRegistration />} />
          <Route path="/teacher-register" element={<TeacherRegistration />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/find-mentors" element={<FindMentors />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
           <Route path="/booksession"element={<BookSession />} />
           

          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/schedule-management" element={<ScheduleManagement />} />
          <Route path="/session-requests" element={<SessionRequests />} />
          <Route path="/feedback-rating" element={<FeedbackRating />} />
          <Route path="/mentor-messages" element={<MentorMessages />} />
          <Route path="/mentor-settings" element={<MentorSettings />} />
          <Route path="/student-settings" element={<StudentSettings />} />
        </Routes>
      </main>
      
      {/* Render Footer if not on excluded pages */}
      {!isExcludedPath && <Footer />}
    </div>
  );
}

// Wrap App in Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
