import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto text-center py-20">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Master IIT JEE with Precision Analysis
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Personalized insights to boost your score.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="bg-gray-200 text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Sign Up Free
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Take Tests</h3>
            <p>Full-length mocks and topic-wise practice.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Analyze Performance</h3>
            <p>Detailed insights to improve.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p>Stay on top of your preparation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
