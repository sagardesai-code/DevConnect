const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.json({
    success: true,
    message: "Welcome to DevConnect API Version 2 🚀"
});
});

module.exports = app;

