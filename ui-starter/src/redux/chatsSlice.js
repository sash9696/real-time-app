import { createSlice } from "@reduxjs/toolkit";
import { staticChats, staticNotifications } from "../data/staticData";

const initialState = {
  chats: staticChats,
  activeChat: staticChats[0] || "",
  isLoading: false,
  notifications: staticNotifications,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,

  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats = [action.payload, ...state.chats];
    },
    fetchChats: (state) => {
      // In static mode, chats are already in state
      // This is kept for compatibility - no-op in static mode
      state.chats = staticChats;
    },
  },
});

export const { setActiveChat, setNotifications, setChats, addChat, fetchChats } = chatsSlice.actions;
export default chatsSlice.reducer;

