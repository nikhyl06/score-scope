import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-6">
        {/* Hero Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Master IIT JEE with Precision Analysis
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Personalized insights to boost your score
          </p>
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="border border-blue-500 text-blue-500 text-sm px-4 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Take Tests
            </h3>
            <p className="text-xs text-gray-600">
              Full-length mocks and topic-wise practice
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Analyze Performance
            </h3>
            <p className="text-xs text-gray-600">
              Detailed insights to improve
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Track Progress
            </h3>
            <p className="text-xs text-gray-600">
              Stay on top of your preparation
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            How It Works
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="border-l-2 border-blue-500 pl-3">
              Sign up and start with a diagnostic test
            </li>
            <li className="border-l-2 border-blue-500 pl-3">
              Receive tailored analysis and study plans
            </li>
            <li className="border-l-2 border-blue-500 pl-3">
              Practice with targeted tests and track improvement
            </li>
          </ul>
        </div>

        {/* Testimonials Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            What Students Say
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 italic">
                "The analysis helped me focus on my weak areas and improve my
                score by 20%."
              </p>
              <p className="text-xs text-gray-500 mt-1">
                - Priya, IIT JEE Aspirant
              </p>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 italic">
                "Simple and effective. I love the study plan feature."
              </p>
              <p className="text-xs text-gray-500 mt-1">
                - Arjun, IIT JEE 2024
              </p>
            </div>
          </div>
        </div>

        {/* New Components */}
        {/* Pricing Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Free Plan
              </h3>
              <p className="text-xs text-gray-600">Basic tests and analysis</p>
              <p className="text-sm text-gray-800 mt-2">₹0/month</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Premium Plan
              </h3>
              <p className="text-xs text-gray-600">
                Unlimited tests, detailed insights
              </p>
              <p className="text-sm text-gray-800 mt-2">₹499/month</p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-block mt-4 text-sm text-blue-500 border border-blue-500 px-4 py-2 rounded-md hover:bg-blue-50"
          >
            Choose a Plan
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium">What types of tests are available?</p>
              <p className="text-xs">
                Full-length IIT JEE mocks, subject-specific, and topic-wise
                tests
              </p>
            </div>
            <div>
              <p className="font-medium">How is the analysis generated?</p>
              <p className="text-xs">
                Based on your performance, time spent, and common mistake
                patterns
              </p>
            </div>
            <div>
              <p className="font-medium">Can I access it on mobile?</p>
              <p className="text-xs">Yes, the platform is fully responsive</p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            By the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-md font-medium text-gray-800">5000+</p>
              <p className="text-xs text-gray-600">Students enrolled</p>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-md font-medium text-gray-800">1000+</p>
              <p className="text-xs text-gray-600">Tests completed</p>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-md font-medium text-gray-800">95%</p>
              <p className="text-xs text-gray-600">Satisfaction rate</p>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="border border-gray-200 rounded-md p-6 bg-white text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Ready to Start?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Join thousands of students preparing smarter
          </p>
          <Link
            to="/signup"
            className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
