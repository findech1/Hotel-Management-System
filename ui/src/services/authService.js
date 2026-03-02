import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";

export const register = (username, password) => {
  return axios.post(API_URL + "signup", {
    username,
    password,
  });
};

export const login = (username, password) => {
  console.log("authService.login called with:", username);
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      console.log("Login response received:", response.data);
      if (response.data.token) {
        console.log("Token found, storing in localStorage");
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Login request failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
