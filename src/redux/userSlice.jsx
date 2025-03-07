import { createSlice } from "@reduxjs/toolkit";

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
      const existingTestIndex = state.tests.findIndex(
        (t) => t._id === testResult._id
      );
      if (existingTestIndex === -1) {
        state.tests.push(testResult);
      } else {
        state.tests[existingTestIndex] = testResult;
      }
    },
  },
});

export const { login, logout, updateUser, addTestResult } = userSlice.actions;
export default userSlice.reducer;
