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
      state.tests.push(action.payload);
    },
  },
});

export const { login, logout, updateUser, addTestResult } = userSlice.actions;
export default userSlice.reducer;
