//createAsyncThunk
//fetch the data using redux

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showProfile: false,
  showNotifications: false
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setShowProfile: (state, action) => {
      state.showProfile= action.payload;
     
    },
    setShowNotifications: (state, action) => {
        state.showNotifications= action.payload;

    },
  },
});

export const {setShowProfile, setShowNotifications}  = profileSlice.actions;

export default profileSlice.reducer;

