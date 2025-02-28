import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    tests: [],
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tests = action.payload.tests || [];
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.tests = [];
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
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
