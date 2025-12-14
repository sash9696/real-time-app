// Mock API functions that return static data
// import { staticMessages as staticMessagesData, staticActiveUser } from "../data/staticData";

// Create a mutable copy of messages
// let staticMessages = JSON.parse(JSON.stringify(staticMessagesData));

// Simulate API delay
// const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

import axios from "axios";

let url = import.meta.env.VITE_API_URL;

const API = (token) =>
  axios.create({
    baseURL: url,
    headers: { Authorization: token },
  });

// Mock implementations - commented out
// export const sendMessage = async (body) => {
//   await delay(200);
//   const newMessage = {
//     _id: "msg_" + Date.now(),
//     sender: staticActiveUser,
//     message: body.message,
//     chatId: body.chatId,
//     createdAt: new Date().toISOString()
//   };
//   
//   // Add to static messages
//   if (!staticMessages[body.chatId]) {
//     staticMessages[body.chatId] = [];
//   }
//   staticMessages[body.chatId].push(newMessage);
//   
//   return newMessage;
// };

export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).post('/api/message', body);
    return data;
  } catch (error) {
    console.log("Error in sendMessage api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const fetchMessages = async (chatId) => {
//   await delay(300);
//   return staticMessages[chatId] || [];
// };

export const fetchMessages = async (chatId) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return [];
    }
    const { data } = await API(token).get(`/api/message/${chatId}`);
    return data;
  } catch (error) {
    console.log("Error in fetchMessages api", error);
    return [];
  }
};

