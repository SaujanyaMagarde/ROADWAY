import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    captaindata: null, 
    isAuthenticated: false,  
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
    },
  });
  
  export const { login, logout } = captainauthSlice.actions;
  export default captainauthSlice.reducer;
  