const express = require('express');
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const requireAuth = require("./middleware/auth.middleware");

const app = express();
app.use(express.json({ limit: "10kb"}));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", requireAuth, taskRoutes); //api/tasks se shuru hone waali requests taskRoutes router ko milengi



app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Server is healthy"
    });
});

app.get("/api/auth/check", requireAuth, (req, res) => {
    return res.status(200).json({
        message: "Authentication successful",
        userId: req.userId
    });
});

app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports = app;