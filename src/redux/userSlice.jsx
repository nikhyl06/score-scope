import { createSlice } from "@reduxjs/toolkit";

// Initial state checks localStorage for token and user
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  tests: [], // Array of full test result objects
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tests = action.payload.tests || []; // Expect full test objects from backend if provided
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tests = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    addTestResult: (state, action) => {
      const testResult = action.payload;
      // Validate payload
      if (!testResult || !testResult._id) {
        console.error("Invalid test result payload:", testResult);
        return; // Prevent invalid updates
      }
      // Check if test already exists by _id
      const existingTestIndex = state.tests.findIndex(
        (t) => t._id === testResult._id
      );
      if (existingTestIndex === -1) {
        state.tests.push(testResult); // Add full test result object
      } else {
        state.tests[existingTestIndex] = testResult; // Update existing test
      }
    },
  },
});

export const { login, logout, updateUser, addTestResult } = userSlice.actions;
export default userSlice.reducer;
