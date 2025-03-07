// src/components/ImageUploader.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { questionHierarchy } from "../data/questionHierarchy"; // Adjust path as needed

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [chapter, setChapter] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(""); // Reset URL when a new file is selected
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setTopic(""); // Reset topic and chapter when subject changes
    setChapter("");
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setChapter(""); // Reset chapter when topic changes
  };

  const handleChapterChange = (e) => {
    setChapter(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }
    if (!subject || !topic || !chapter) {
      toast.error("Please select subject, topic, and chapter");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "folder",
      `iit-jee-questions/${subject}/${topic}/${chapter}`
    );

    try {
      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const url = response.data.url;
      setImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(imageUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-6 bg-white">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Upload Image</h3>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Subject</label>
        <select
          value={subject}
          onChange={handleSubjectChange}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          disabled={uploading}
        >
          <option value="">Select Subject</option>
          {Object.keys(questionHierarchy).map((sub) => (
            <option key={sub} value={sub}>
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {subject && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Topic</label>
          <select
            value={topic}
            onChange={handleTopicChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            disabled={uploading}
          >
            <option value="">Select Topic</option>
            {Object.keys(questionHierarchy[subject]).map((top) => (
              <option key={top} value={top}>
                {top
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>
      )}
      {topic && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Chapter</label>
          <select
            value={chapter}
            onChange={handleChapterChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            disabled={uploading}
          >
            <option value="">Select Chapter</option>
            {questionHierarchy[subject][topic].map((chap) => (
              <option key={chap} value={chap}>
                {chap
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-600 mb-2"
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        disabled={uploading || !file || !chapter}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      {imageUrl && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 break-all">
            URL:{" "}
            <a href={imageUrl} target="_blank" className="text-blue-500">
              {imageUrl}
            </a>
          </p>
          <button
            onClick={handleCopy}
            className="mt-2 w-full border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100"
          >
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
