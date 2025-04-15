import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    captaindata: null, 
    isAuthenticated: false,
    rideData :null,
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
    }
  },
});
  
  export const { login, logout ,fillride,emptyride} = captainauthSlice.actions;
  export default captainauthSlice.reducer;
  