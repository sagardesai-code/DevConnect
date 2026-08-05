const express = require("express");
const {
    createPost,
    getAllPosts,
    deletePost,
    updatePost,
} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

module.exports = router;