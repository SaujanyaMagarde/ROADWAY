import { createSlice } from "@reduxjs/toolkit";
import { Route } from "react-router-dom";

const initialState = {
  userdata: null, 
  status: false,
  rideData : null,
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
    rideStart :(state,action)=>{
      state.rideData = action.payload;
    },
    rideend : (state)=>{
      state.rideData = null;
    }
  },
});

export const { login, logout,rideStart,rideend} = authSlice.actions;
export default authSlice.reducer;
