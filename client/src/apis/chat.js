// Mock API functions that return static data
// import { staticChats, staticUsers, staticActiveUser } from "../data/staticData";
import axios from "axios";

let url = import.meta.env.VITE_API_URL;

console.log("url", url);

const API = (token) =>
  axios.create({
    baseURL: url,
    headers: { Authorization: token },
  });

// Simulate API delay
// const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock implementations - commented out
// export const removeUser = async (body) => {
//   await delay();
//   return { _id: body.chatId, success: true };
// };

export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    return data;
  } catch (error) {
    console.log("Error in removeUser api", error);
    throw error;
  }
};

export const accessCreate = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).post('/api/chat', body);
    return data;
  } catch (error) {
    console.log("Error in accessCreate api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const accessCreate = async (body) => {
//   await delay();
//   // Find or create a chat with the user
//   const existingChat = staticChats.find(chat => 
//     !chat.isGroup && 
//     chat.users.some(u => u._id === body.userId)
//   );
//   
//   if (existingChat) {
//     return existingChat;
//   }
//   
//   // Create new chat
//   const otherUser = staticUsers.find(u => u._id === body.userId);
//   const newChat = {
//     _id: "chat_" + Date.now(),
//     isGroup: false,
//     chatName: otherUser?.name || "New Chat",
//     users: [staticActiveUser, otherUser],
//     latestMessage: null,
//     updatedAt: new Date().toISOString()
//   };
//   
//   return newChat;
// };

// Mock implementations - commented out
// export const fetchAllChats = async () => {
//   await delay(300);
//   return staticChats;
// };

export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return [];
    }
    const { data } = await API(token).get('/api/chat');
    return data;
  } catch (error) {
    console.log("Error in fetchAllChats api", error);
    return [];
  }
};

// Mock implementations - commented out
// export const createGroup = async (body) => {
//   await delay();
//   const userIds = JSON.parse(body.users);
//   const selectedUsers = staticUsers.filter(u => userIds.includes(u._id));
//   
//   const newGroup = {
//     _id: "chat_" + Date.now(),
//     isGroup: true,
//     chatName: body.chatName,
//     users: [staticActiveUser, ...selectedUsers],
//     photo: "https://i.pravatar.cc/150?img=10",
//     latestMessage: null,
//     updatedAt: new Date().toISOString()
//   };
//   
//   return newGroup;
// };

export const createGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).post('/api/chat/group', body);
    return data;
  } catch (error) {
    console.log("Error in createGroup api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const renameGroup = async (body) => {
//   await delay();
//   return {
//     _id: body.chatId,
//     chatName: body.chatName,
//     success: true
//   };
// };

export const renameGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).patch('/api/chat/group/rename', body);
    return data;
  } catch (error) {
    console.log("Error in renameGroup api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const addToGroup = async (body) => {
//   await delay();
//   return {
//     _id: body.chatId,
//     userId: body.userId,
//     success: true
//   };
// };

export const addToGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).patch('/api/chat/groupAdd', body);
    return data;
  } catch (error) {
    console.log("Error in addToGroup api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const removeFromGroup = async (body) => {
//   await delay();
//   return {
//     _id: body.chatId,
//     userId: body.userId,
//     success: true
//   };
// };

export const removeFromGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    return data;
  } catch (error) {
    console.log("Error in removeFromGroup api", error);
    throw error;
  }
};

