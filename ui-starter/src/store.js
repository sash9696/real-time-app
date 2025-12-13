import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./redux/activeUserSlice";
import chatsSlice from "./redux/chatsSlice";
import profileSlice from "./redux/profileSlice";


const store = configureStore({
  reducer: {
    activeUser: activeUserSlice,
    chats: chatsSlice,
    profile: profileSlice
  },
});

export default store;

