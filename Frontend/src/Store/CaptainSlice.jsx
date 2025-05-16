import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    captaindata: null, 
    isAuthenticated: false,
    rideData :null,
    userdata : null,
};
  
const captainauthSlice = createSlice({
  name: "captainauth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.captaindata = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.captaindata = null;
      state.isAuthenticated = false;
    },
    fillride : (state,action) =>{
      state.rideData = action.payload;
    },
    emptyride :(state)=>{
      state.rideData = null;
      state.userdata = null;
    },
    filluser : (state,action)=>{
      state.userdata = action.payload;
    },
  },
});
  
  export const { login, logout ,fillride,emptyride,filluser} = captainauthSlice.actions;
  export default captainauthSlice.reducer;
  