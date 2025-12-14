// Mock API functions that return static data
// import { staticActiveUser, staticUsers } from "../data/staticData";
import axios from "axios";

let url = import.meta.env.VITE_API_URL;

console.log("url", url);

const API = (token) =>
  axios.create({
    baseURL: url,
    headers: { Authorization: token },
  });

// Simulate API delay
// const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock implementations - commented out
// export const registerUser = async (body) => {
//   console.log("registerUser (mock)");
//   await delay();
//   return {
//     data: {
//       token: "mock_token_" + Date.now(),
//       user: staticActiveUser
//     }
//   };
// };

export const registerUser = async (body) => {
  console.log("registerUser", body);

  try {
    const { data } = await axios.post(`${url}/auth/register`, body);
    return { data };
  } catch (error) {
    console.log("Error in register api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const loginUser = async (body) => {
//   await delay();
//   return {
//     data: {
//       token: "mock_token_" + Date.now(),
//       user: staticActiveUser
//     }
//   };
// };

export const loginUser = async (body) => {
  try {
    const { data } = await axios.post(`${url}/auth/login`, body);
    return { data };
  } catch (error) {
    console.log("Error in login api", error);
    throw error;
  }
};

// Mock implementations - commented out
// export const validUser = async () => {
//   await delay(200);
//   return {
//     user: staticActiveUser,
//   };
// };

export const validUser = async () => {
  try {
    // Get token and window ID fresh from localStorage each time
    const windowId = localStorage.getItem('windowId');
    const token = localStorage.getItem('userToken');
    
    console.log('validUser API - Window ID:', windowId);
    console.log('validUser API - Token exists:', !!token);
    console.log('validUser API - Token (first 50 chars):', token?.substring(0, 50));
    
    if (!token) {
      return;
    }

    const { data } = await API(token).get('/auth/valid', {
      headers: { Authorization: token }
    });

    // Verify token and window ID haven't changed
    const tokenAfter = localStorage.getItem('userToken');
    const windowIdAfter = localStorage.getItem('windowId');
    
    if (token !== tokenAfter) {
      console.warn('validUser API - Token changed during API call!');
      return;
    }
    
    if (windowId && windowId !== windowIdAfter) {
      console.warn('validUser API - Window ID changed during API call!');
      return;
    }

    console.log('validUser API - Response received:', {
      hasUser: !!data?.user,
      userEmail: data?.user?.email,
      userName: data?.user?.name
    });

    return data;
  } catch (error) {
    console.log("Error in valid user api", error);
  }
};

export const searchUsers = async (searchText) => {
  try {
    if (!searchText || searchText.trim() === "") {
      return { users: [] };
    }
    const token = localStorage.getItem('userToken');
    if (!token) {
      return { users: [] };
    }
    const { data } = await API(token).get(`/api/user?search=${encodeURIComponent(searchText)}`);
    return data;
  } catch (error) {
    console.log("Error in searchUsers api", error);
    return { users: [] };
  }
};

// Mock implementations - commented out
// export const updateUser = async (id, body) => {
//   await delay();
//   return {
//     ...staticActiveUser,
//     ...body,
//   };
// };

export const updateUser = async (id, body) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error("No token found");
    }
    const { data } = await API(token).patch(`/api/users/update/${id}`, body);
    return data;
  } catch (error) {
    console.log("Error in updateUser api", error);
    throw error;
  }
};

export const checkValid = async () => {
  const data = await validUser();
  if (!data?.user) {
    window.location.href = "/login";
  } else {
    window.location.href = "/chats";
  }
};

// Mock implementations - commented out
// export const logoutUser = async () => {
//   await delay();
//   localStorage.removeItem('userToken');
//   window.location.href = '/login';
//   return { success: true };
// };

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("userToken");
    if (token) {
      //call the logout api
      await API(token).get(`/auth/logout`);
    }
    localStorage.removeItem("userToken");
    window.location.href = "/login";
    return { success: true };
  } catch (error) {
    console.log("Error in logout api", error);
    localStorage.removeItem("userToken");
    window.location.href = "/login";
    return { success: true };
  }
};
