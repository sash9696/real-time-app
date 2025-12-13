// Mock API functions that return static data
import { staticActiveUser, staticUsers } from "../data/staticData";

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const registerUser = async (body) => {
  console.log("registerUser (mock)");
  await delay();
  return {
    data: {
      token: "mock_token_" + Date.now(),
      user: staticActiveUser
    }
  };
};

export const loginUser = async (body) => {
  await delay();
  return {
    data: {
      token: "mock_token_" + Date.now(),
      user: staticActiveUser
    }
  };
};

export const validUser = async () => {
  await delay(200);
  return {
    user: staticActiveUser
  };
};

export const searchUsers = async (searchText) => {
  await delay(300);
  if (!searchText || searchText.trim() === "") {
    return { users: [] };
  }
  const filtered = staticUsers.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );
  return { users: filtered };
};

export const updateUser = async (id, body) => {
  await delay();
  return {
    ...staticActiveUser,
    ...body
  };
};

export const checkValid = async () => {
  const data = await validUser();
  if(!data?.user){
    window.location.href = '/login';
  }else{
    window.location.href = '/chats';
  }
};

export const logoutUser = async () => {
  await delay();
  localStorage.removeItem('userToken');
  window.location.href = '/login';
  return { success: true };
};

