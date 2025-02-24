import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { isAuthenticated: false, name: "", tests: [] },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = "";
      state.tests = [];
    },
    addTest: (state, action) => {
      state.tests.push(action.payload);
    },
  },
});

export const { login, logout, addTest } = userSlice.actions;
export default userSlice.reducer;
