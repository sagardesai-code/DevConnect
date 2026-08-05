const express = require("express");

const {
    createComment,
    getComments,
    deleteComment,
} = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:postId", authMiddleware, createComment);
router.get("/:postId", authMiddleware, getComments);
router.delete("/:id", authMiddleware, deleteComment);


module.exports = router;