const express = require("express");
const {
    createPost,
    getAllPosts,
    deletePost,
    updatePost,
    likePost,
    unlikePost,
} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/unlike", authMiddleware, unlikePost);

module.exports = router;