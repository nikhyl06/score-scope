import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const LandingPage = () => (
  <div className="container py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Score Scope
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Your ultimate companion for IIT JEE preparation with personalized tests
        and deep analytics.
      </p>
      <Link
        to="/signup"
        className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
      >
        Get Started
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Practice Tests">
        <p className="text-sm text-gray-600">
          Access a wide range of IIT JEE practice tests.
        </p>
      </Card>
      <Card title="Detailed Analysis">
        <p className="text-sm text-gray-600">
          Get actionable insights to boost your performance.
        </p>
      </Card>
      <Card title="Study Plans">
        <p className="text-sm text-gray-600">
          Create personalized plans to stay on track.
        </p>
      </Card>
    </div>
  </div>
);

export default LandingPage;
