import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/userSlice";
import api from "./api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import TestSelectionPage from "./pages/TestSelectionPage";
import TestInterfacePage from "./pages/TestInterfacePage";
import TestSummaryPage from "./pages/TestSummaryPage";
import AnalysisPage from "./pages/AnalysisPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import ProfilePage from "./pages/ProfilePage";
import AdminCreateTestPage from "./pages/AdminCreateTestPage";
import AdminManageQuestionsPage from "./pages/AdminManageQuestionsPage";
import AdminManageUsersPage from "./pages/AdminManageUsersPage";
import EditQuestionPage from "./pages/EditQuestionPage";
import AddQuestionPage from "./pages/AddQuestionPage";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user && !isAuthenticated) {
      const verifyToken = async () => {
        try {
          const response = await api.get("/auth/me");
          dispatch(login({ user: response.data, token }));
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      };
      verifyToken();
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-selection"
              element={
                <ProtectedRoute>
                  <TestSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test/:testId"
              element={
                <ProtectedRoute>
                  <TestInterfacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-summary/:testId"
              element={
                <ProtectedRoute>
                  <TestSummaryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <AnalysisPage />
                </ProtectedRoute>
              }
            />

            {/* New route */}
            <Route
              path="/study-plan"
              element={
                <ProtectedRoute>
                  <StudyPlanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-test"
              element={
                <ProtectedRoute adminOnly>
                  <AdminCreateTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-questions"
              element={
                <ProtectedRoute adminOnly>
                  <AdminManageQuestionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-question/:questionId"
              element={
                <ProtectedRoute adminOnly>
                  <EditQuestionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-question"
              element={
                <ProtectedRoute adminOnly>
                  <AddQuestionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminManageUsersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
