const Post = require("../models/post.model");

const createPost = async (req, res) => {
    try {

        const { content } = req.body;
        const post = await Post.create({
    content,
    user: req.user.userId,
});

return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
});


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllPosts = async (req, res) => {
    try {

       const posts = await Post.find()
    .populate("user", "-password")
    .sort({ createdAt: -1 });

        return res.status(200).json({
    success: true,
    posts,
});


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {

        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
    return res.status(404).json({
        success: false,
        message: "Post not found",
    });
}

if (post.user.toString() !== req.user.userId) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
    });
}

await post.deleteOne();

return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
});

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePost = async (req, res) => {
    try {

        const { id } = req.params;
        const { content } = req.body;

        const post = await Post.findById(id);

if (!post) {
    return res.status(404).json({
        success: false,
        message: "Post not found",
    });
}

if (post.user.toString() !== req.user.userId) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
    });
}

post.content = content;

await post.save();

return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
});



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    updatePost,
};