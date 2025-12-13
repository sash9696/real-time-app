import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { staticChats, staticNotifications } from "../data/staticData";
import { fetchAllChats } from "../apis/chat";

const initialState = {
  chats: [],
  activeChat: "",
  isLoading: false,
  notifications: [],
};

export const fetchChats = createAsyncThunk("redux/chats", async () => {
  
  try {

    const data  = await fetchAllChats();
    console.log('fetch chats', data)
    return data;
    
  } catch (error) {
    console.log("error fetching chats")
  }
})

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
    // fetchChats: (state) => {
    //   // In static mode, chats are already in state
    //   // This is kept for compatibility - no-op in static mode
    //   state.chats = staticChats;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending , (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChats.fulfilled , (state, action) => {
        state.chats = action.payload
        state.isLoading = false;
      })
      .addCase(fetchChats.rejected , (state) => {
        state.isLoading = false;
      })
  }
});

export const { setActiveChat, setNotifications, setChats, addChat} = chatsSlice.actions;
export default chatsSlice.reducer;

