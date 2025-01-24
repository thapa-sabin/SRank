import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add Authorization header to all requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
