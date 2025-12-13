// Mock API functions that return static data
import { staticChats, staticUsers, staticActiveUser } from "../data/staticData";

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const removeUser = async (body) => {
  await delay();
  return { _id: body.chatId, success: true };
};

export const accessCreate = async (body) => {
  await delay();
  // Find or create a chat with the user
  const existingChat = staticChats.find(chat => 
    !chat.isGroup && 
    chat.users.some(u => u._id === body.userId)
  );
  
  if (existingChat) {
    return existingChat;
  }
  
  // Create new chat
  const otherUser = staticUsers.find(u => u._id === body.userId);
  const newChat = {
    _id: "chat_" + Date.now(),
    isGroup: false,
    chatName: otherUser?.name || "New Chat",
    users: [staticActiveUser, otherUser],
    latestMessage: null,
    updatedAt: new Date().toISOString()
  };
  
  return newChat;
};

export const fetchAllChats = async () => {
  await delay(300);
  return staticChats;
};

export const createGroup = async (body) => {
  await delay();
  const userIds = JSON.parse(body.users);
  const selectedUsers = staticUsers.filter(u => userIds.includes(u._id));
  
  const newGroup = {
    _id: "chat_" + Date.now(),
    isGroup: true,
    chatName: body.chatName,
    users: [staticActiveUser, ...selectedUsers],
    photo: "https://i.pravatar.cc/150?img=10",
    latestMessage: null,
    updatedAt: new Date().toISOString()
  };
  
  return newGroup;
};

export const renameGroup = async (body) => {
  await delay();
  return {
    _id: body.chatId,
    chatName: body.chatName,
    success: true
  };
};

export const addToGroup = async (body) => {
  await delay();
  return {
    _id: body.chatId,
    userId: body.userId,
    success: true
  };
};

export const removeFromGroup = async (body) => {
  await delay();
  return {
    _id: body.chatId,
    userId: body.userId,
    success: true
  };
};

