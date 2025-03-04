import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function TestSelectionPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/api/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(response.data);
      } catch (error) {
        toast.error("Error fetching tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [token]);

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.exam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Choose a Test
            </h1>
            <p className="text-sm text-gray-600">
              Select a test to start your practice
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 mb-6 bg-white">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests by name or exam..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Available Tests ({filteredTests.length})
            </h2>
            {loading ? (
              <div>Loading tests...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 transition"
                  >
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      {test.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {test.exam} - Class {test.class}
                    </p>
                    <p className="text-xs text-gray-500">
                      Questions: {test.questions.length}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Marks: {test.metadata.marks} | Time:{" "}
                      {Math.floor(test.metadata.timeAllotted / 60000)} min
                    </p>
                    <button
                      onClick={() => navigate(`/test/${test._id}`)}
                      className="w-full border border-blue-500 text-blue-500 text-sm p-2 rounded-md hover:bg-blue-50 transition"
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TestSelectionPage;
