// Mock API functions that return static data
import { staticMessages as staticMessagesData, staticActiveUser } from "../data/staticData";

// Create a mutable copy of messages
let staticMessages = JSON.parse(JSON.stringify(staticMessagesData));

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (body) => {
  await delay(200);
  const newMessage = {
    _id: "msg_" + Date.now(),
    sender: staticActiveUser,
    message: body.message,
    chatId: body.chatId,
    createdAt: new Date().toISOString()
  };
  
  // Add to static messages
  if (!staticMessages[body.chatId]) {
    staticMessages[body.chatId] = [];
  }
  staticMessages[body.chatId].push(newMessage);
  
  return newMessage;
};

export const fetchMessages = async (chatId) => {
  await delay(300);
  return staticMessages[chatId] || [];
};

