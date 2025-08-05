const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to TODO rest-api" });
});
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

// error handler
app.use((err, req, res, next) => {
    console.log(err);
    const code = err.statusCode || 500;
    const message = err.message;
    const data = err.data || null;

    res.status(code).json({ message, data });
});

module.exports = app;
