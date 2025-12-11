import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // You might add authorization headers here after login
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

// --- Existing API examples from frontend_setup.txt ---
