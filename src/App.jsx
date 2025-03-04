import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/userSlice";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import TestSelectionPage from "./pages/TestSelectionPage";
import TestInterfacePage from "./pages/TestInterfacePage";
import TestSummaryPage from "./pages/TestSummaryPage";
import AnalysisPage from "./pages/AnalysisPage";
import AnalysisHistoryPage from "./pages/AnalysisHistoryPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LogoutConfirmationPage from "./pages/LogoutConfirmationPage";
import EditQuestionPage from "./pages/EditQuestionPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageQuestionsPage from "./pages/ManageQuestionsPage";
import CreateTestPage from "./pages/CreateTestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MarkdownEditor from "./pages/MarkdownEditor";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user && !isAuthenticated) {
      const verifyToken = async () => {
        try {
          const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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
          path="/analysis/:testId"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis-history"
          element={
            <ProtectedRoute>
              <AnalysisHistoryPage />
            </ProtectedRoute>
          }
        />
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
          path="/logout"
          element={
            <ProtectedRoute>
              <LogoutConfirmationPage />
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
          path="/manage-users"
          element={
            <ProtectedRoute adminOnly>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-questions"
          element={
            <ProtectedRoute adminOnly>
              <ManageQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-test"
          element={
            <ProtectedRoute adminOnly>
              <CreateTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
              <MarkdownEditor />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
