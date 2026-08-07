import axios from "axios";

const api = axios.create({
  baseURL: "https://devconnect-obop.onrender.com/api",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// Authentication
// =========================

export const registerUser = (userData) =>
  api.post("/users/register", userData);

export const loginUser = (userData) =>
  api.post("/users/login", userData);

// =========================
// Posts
// =========================

export const getAllPosts = () => api.get("/posts");

export const createPost = (content) =>
  api.post("/posts", { content });

export const likePost = (postId) =>
  api.post(`/posts/${postId}/like`);

export const unlikePost = (postId) =>
  api.post(`/posts/${postId}/unlike`);

// =========================
// Comments
// =========================

export const getComments = (postId) =>
  api.get(`/comments/${postId}`);

export const createComment = (postId, content) =>
  api.post(`/comments/${postId}`, { content });

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);

// =========================
// Profile
// =========================

export const getProfile = () =>
  api.get("/users/profile");

export const updateProfile = (userData) =>
  api.put("/users/profile", userData);

export default api;