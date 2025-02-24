import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const { name, tests } = useSelector((state) => state.user);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Hi {name}, ready to ace IIT JEE?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Tests Taken</h3>
            <p className="text-2xl">{tests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Average Score</h3>
            <p className="text-2xl">
              {tests.length
                ? (
                    tests.reduce((acc, t) => acc + t.score, 0) / tests.length
                  ).toFixed(2)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Last Test</h3>
            <p className="text-2xl">
              {tests.length ? `${tests[tests.length - 1].score}%` : "N/A"}
            </p>
          </div>
        </div>
        <Link
          to="/test-selection"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8 inline-block"
        >
          Take a Test
        </Link>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Tests</h2>
          {tests.length ? (
            <ul className="space-y-4">
              {tests.map((test) => (
                <li
                  key={test.id}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <span>
                    {test.name} - {test.score}%
                  </span>
                  <Link
                    to={`/analysis/${test.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Analysis
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tests taken yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
