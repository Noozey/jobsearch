import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Change to your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
