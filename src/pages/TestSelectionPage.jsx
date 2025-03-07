import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";

const TestSelectionPage = () => {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await api.get("/tests");
        setTests(response.data);
      } catch (error) {
        toast.error("Error fetching tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.exam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Choose a Test</h1>
      <Card className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading tests...</p>
        ) : filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <Card key={test._id} title={test.name}>
              <p className="text-sm text-gray-600 mb-2">
                {test.exam} - Class {test.class}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Questions: {test.questions.length} | Time:{" "}
                {Math.floor(test.metadata.timeAllotted / 60000)} min
              </p>
              <Button
                onClick={() => navigate(`/test/${test._id}`)}
                variant="secondary"
              >
                Start Test
              </Button>
            </Card>
          ))
        ) : (
          <p>No tests found.</p>
        )}
      </div>
    </div>
  );
};

export default TestSelectionPage;
