import { createSlice } from "@reduxjs/toolkit";

// Initial state checks localStorage for token and user
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  tests: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tests = action.payload.tests || [];
      // Persist to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tests = [];
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    addTestResult: (state, action) => {
      const newTests = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.tests = [
        ...new Set([...state.tests, ...newTests.map((t) => t._id)]),
      ].map(
        (id) =>
          newTests.find((t) => t._id === id) ||
          state.tests.find((t) => t._id === id)
      );
    },
  },
});

export const { login, logout, updateUser, addTestResult } = userSlice.actions;
export default userSlice.reducer;
