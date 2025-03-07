import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";

const StudyPlanPage = () => {
  const [plan, setPlan] = useState({ tasks: [], targetScore: "" });
  const [newTask, setNewTask] = useState({ description: "", dueDate: "" });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get("/study-plan");
        setPlan(response.data);
      } catch (error) {
        toast.error("Error fetching study plan");
      }
    };
    fetchPlan();
  }, []);

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...plan.tasks];
    updatedTasks[index][field] = value;
    setPlan({ ...plan, tasks: updatedTasks });
  };

  const addTask = async () => {
    const updatedTasks = [...plan.tasks, { ...newTask, completed: false }];
    try {
      const response = await api.put("/study-plan", {
        tasks: updatedTasks,
        targetScore: plan.targetScore,
      });
      setPlan(response.data);
      setNewTask({ description: "", dueDate: "" });
      toast.success("Task added!");
    } catch (error) {
      toast.error("Error adding task");
    }
  };

  const updatePlan = async () => {
    try {
      const response = await api.put("/study-plan", plan);
      setPlan(response.data);
      toast.success("Plan updated!");
    } catch (error) {
      toast.error("Error updating plan");
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Study Plan</h1>
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Set Your Goal</h2>
        <input
          type="number"
          value={plan.targetScore || ""}
          onChange={(e) => setPlan({ ...plan, targetScore: e.target.value })}
          placeholder="Target Score (%)"
          className="w-full max-w-xs p-2 border border-gray-300 rounded-md mb-4"
        />
        <Button onClick={updatePlan}>Update Goal</Button>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold mb-4">Tasks</h2>
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
                      ? "line-through text-gray-400"
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
                  className="text-blue-500 hover:underline text-sm"
                >
                  Take Test
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="New task"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <Button onClick={addTask} variant="secondary" className="w-full">
            Add Task
          </Button>
        </div>
        <Button onClick={updatePlan} className="w-full mt-4">
          Save Changes
        </Button>
      </Card>
    </div>
  );
};

export default StudyPlanPage;
