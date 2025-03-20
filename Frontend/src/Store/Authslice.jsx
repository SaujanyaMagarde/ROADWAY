import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userdata: null, 
  status: false,  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userdata = action.payload;
      state.status = true;
    },
    logout: (state) => {
      state.userdata = null;
      state.status = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
