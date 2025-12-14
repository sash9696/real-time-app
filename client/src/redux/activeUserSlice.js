//createAsyncThunk
//fetch the data using redux

import { createSlice } from "@reduxjs/toolkit";
import { staticActiveUser } from "../data/staticData";

// const initialState = {
//   id: staticActiveUser.id,
//   email: staticActiveUser.email,
//   profilePic: staticActiveUser.profilePic,
//   bio: staticActiveUser.bio,
//   name: staticActiveUser.name,
// };
const initialState = {
  id: '',
  email: '',
  profilePic: '',
  bio: '',
  name: '',
};

const activeUserSlice = createSlice({
  name: "activeUser",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      // Only update if we have valid payload
      if (action.payload && action.payload.id) {
        state.id = action.payload.id;
        state.email = action.payload.email || '';
        state.profilePic = action.payload.profilePic || '';
        state.bio = action.payload.bio || '';
        state.name = action.payload.name || '';
      } else {
        // Clear state
        state.id = '';
        state.email = '';
        state.profilePic = '';
        state.bio = '';
        state.name = '';
      }
    },
    setUserNameAndBio: (state, action) => {
      state.bio = action.payload.bio;
      state.name = action.payload.name;
    },
  },
});

export const {setActiveUser, setUserNameAndBio}  = activeUserSlice.actions;

export default activeUserSlice.reducer;

