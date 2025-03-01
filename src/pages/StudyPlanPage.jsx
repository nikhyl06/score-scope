import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function StudyPlanPage() {
  const { token } = useSelector((state) => state.user);
  const [plan, setPlan] = useState({ tasks: [], targetScore: "" });
  const [newTask, setNewTask] = useState({ description: "", dueDate: "" });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get("/api/study-plan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(response.data);
      } catch (error) {
        console.error("Error fetching study plan:", error);
      }
    };
    fetchPlan();
  }, [token]);

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...plan.tasks];
    updatedTasks[index][field] = value;
    setPlan({ ...plan, tasks: updatedTasks });
  };

  const addTask = async () => {
    const updatedTasks = [...plan.tasks, { ...newTask, completed: false }];
    try {
      const response = await api.put(
        "/api/study-plan",
        { tasks: updatedTasks, targetScore: plan.targetScore },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(response.data);
      setNewTask({ description: "", dueDate: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updatePlan = async () => {
    try {
      const response = await api.put("/api/study-plan", plan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlan(response.data);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Study Plan
            </h1>
            <p className="text-sm text-gray-600">
              Organize your IIT JEE preparation
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Set Your Goal
            </h2>
            <input
              type="number"
              value={plan.targetScore || ""}
              onChange={(e) =>
                setPlan({ ...plan, targetScore: e.target.value })
              }
              placeholder="Target Score (e.g., 90%)"
              className="w-full max-w-xs p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={updatePlan}
              className="bg-blue-500 text-white text-sm px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Plan
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current Tasks
            </h2>
            <ul className="space-y-4">
              {plan.tasks.map((task, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) =>
                        handleTaskChange(index, "completed", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span
                      className={`text-sm ${
                        task.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-600"
                      }`}
                    >
                      {task.description} (Due:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                      )
                    </span>
                  </div>
                  {task.testId && (
                    <Link
                      to={`/test/${task.testId}`}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Take Test
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <input
                type="text"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="New task description"
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <button
                onClick={addTask}
                className="w-full border border-blue-500 text-blue-500 text-sm p-2 rounded-md hover:bg-blue-50 transition"
              >
                Add Task
              </button>
            </div>
            <button
              onClick={updatePlan}
              className="mt-4 w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default StudyPlanPage;
