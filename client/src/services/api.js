import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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