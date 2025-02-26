import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import LogoutConfirmationPage from "./pages/LogoutConfirmationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-selection" element={<TestSelectionPage />} />
        <Route path="/test/:testId" element={<TestInterfacePage />} />
        <Route path="/test-summary/:testId" element={<TestSummaryPage />} />
        <Route path="/analysis/:testId" element={<AnalysisPage />} />
        <Route path="/analysis-history" element={<AnalysisHistoryPage />} />
        <Route path="/study-plan" element={<StudyPlanPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/logout" element={<LogoutConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
