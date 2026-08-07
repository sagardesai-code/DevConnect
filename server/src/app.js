const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to DevConnect API Version 2 "
    });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;