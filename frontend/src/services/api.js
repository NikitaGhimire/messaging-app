// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://msg-app-0e48ba52a8ee.herokuapp.com",
    headers: {
    'Content-Type': 'application/json',
}, // Your backend API
});

// Attach token to each request if needed
api.interceptors.request.use(config => {
//     console.log("Request Headers:", config.headers);  // Add this line to log headers
//   const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    return config;
}, (error) => {
    return Promise.reject(error);
  });
export default api;
