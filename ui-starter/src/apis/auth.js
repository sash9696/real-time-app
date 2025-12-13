// Mock API functions that return static data
import { staticActiveUser, staticUsers } from "../data/staticData";
import axios from "axios";

let url = import.meta.env.VITE_API_URL;

console.log("url", url);

const API = (token) =>
  axios.create({
    baseURL: url,
    headers: { Authorization: token },
  });

// Simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const data = axios.post(`${url}/auth/register`, body);
    return data;
  } catch (error) {
    console.log("Error in register api", error);
  }
};
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
  const data = axios.post(`${url}/auth/login`, body);
  return data;
};
// export const validUser = async () => {
//   await delay(200);
//   return {
//     user: staticActiveUser,
//   };
// };

export const validUser = async () => {

  try {

    const token = localStorage.getItem('userToken');

    const {data} = await API(token).get(`/auth/valid`)
    return data;
  } catch (error) {
    console.log("Error in valid user", error)
  }
};

export const searchUsers = async (searchText) => {
  await delay(300);
  if (!searchText || searchText.trim() === "") {
    return { users: [] };
  }
  const filtered = staticUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );
  return { users: filtered };
};

export const updateUser = async (id, body) => {
  await delay();
  return {
    ...staticActiveUser,
    ...body,
  };
};

export const checkValid = async () => {
  const data = await validUser();
  if (!data?.user) {
    window.location.href = "/login";
  } else {
    window.location.href = "/chats";
  }
};

// export const logoutUser = async () => {
//   await delay();
//   localStorage.removeItem('userToken');
//   window.location.href = '/login';
//   return { success: true };
// };

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("userToken");

    //call the logout api
    const { data } = await API(token).get(`/auth/logout`);
    localStorage.removeItem("userToken");
    window.location.href = "/login";
    return data;
  } catch (error) {
    console.log("Error in logout api", error);
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  }

  return { success: true };
};
