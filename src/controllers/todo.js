const Todos = require("../models/todo");

async function getTodos(req, res, next) {
    try {
        const todos = await Todos.find();

        res.status(200).json({
            message: "todos fetched successful",
            todos,
        });
    } catch (error) {
        next(error);
    }
}

async function getTodo(req, res, next) {
    const todoId = req.params.id;
    console.log(todoId);

    try {
        const todo = await Todos.findById(todoId);

        if (!todo) {
            const error = new Error("could not find todo");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            todo,
        });
    } catch (error) {
        next(error);
    }
}

async function createTodo(req, res, next) {}

module.exports = {
    getTodos,
    getTodo,
    createTodo,
};
