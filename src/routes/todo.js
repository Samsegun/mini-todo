const { Router } = require("express");

const todoRouter = Router();

todoRouter.get("/", (req, res) => {
    res.status(200).json({
        todos: [
            {
                id: 1,
                title: "Buy groceries",
                description: "Milk, bread, eggs",
                completed: false,
                createdAt: "2024-08-02T10:30:00Z",
                updatedAt: "2024-08-02T10:30:00Z",
            },
            {
                id: 2,
                title: "Buy phone",
                description: "Buy a iphone 16 pro",
                completed: false,
                createdAt: "2024-08-02T10:30:00Z",
                updatedAt: "2024-08-02T10:30:00Z",
            },
        ],
    });
});

todoRouter.get("/:id", (req, res) => {
    const todoId = req.params.id;

    console.log(todoId);

    res.status(200).json({
        todos: {
            id: 2,
            title: "Buy phone",
            description: "Buy a iphone 16 pro",
            completed: false,
            createdAt: "2024-08-02T10:30:00Z",
            updatedAt: "2024-08-02T10:30:00Z",
        },
    });
});

module.exports = todoRouter;
