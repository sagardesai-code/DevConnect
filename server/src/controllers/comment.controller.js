const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const createComment = async (req, res) => {
    try {

        const { content } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);

if (!post) {
    return res.status(404).json({
        success: false,
        message: "Post not found",
    });
}

const comment = await Comment.create({
    content,
    user: req.user.userId,
    post: postId,
});

return res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comment,
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getComments = async (req, res) => {
    try {

        const { postId } = req.params;
        const post = await Post.findById(postId);

if (!post) {
    return res.status(404).json({
        success: false,
        message: "Post not found",
    });
}

const comments = await Comment.find({
    post: postId,
})
.populate("user", "-password")
.sort({ createdAt: -1 });

return res.status(200).json({
    success: true,
    comments,
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {

        const { id } = req.params;

        const comment = await Comment.findById(id);

if (!comment) {
    return res.status(404).json({
        success: false,
        message: "Comment not found",
    });
}

if (comment.user.toString() !== req.user.userId) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
    });
}

await comment.deleteOne();

return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createComment,
    getComments,
    deleteComment,
};