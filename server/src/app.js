const express = require("express");
const app = express();
app.use(express.json());

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to DevConnect API Version 2 🚀"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;