const Todos = require("../models/todo");
const { mongoIdValidation } = require("../../utils/validations.js");

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

    try {
        if (!mongoIdValidation(todoId)) {
            const error = new Error("Invalid todo ID");
            error.statusCode = 400;
            throw error;
        }

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

async function createTodo(req, res, next) {
    try {
        const result = await Todos.create(req.validatedData);

        if (!result) {
            const error = new error("Failed to create todo");
            error.statusCode = 400;
            throw error;
        }

        res.status(201).json({
            message: "todo created successful",
            todo: result,
        });
    } catch (error) {
        next();
    }
}

async function deleteTodo(req, res, next) {
    const todoId = req.params.id;

    try {
        if (!mongoIdValidation(todoId)) {
            const error = new Error("Invalid todo ID");
            error.statusCode = 400;
            throw error;
        }

        const todo = await Todos.findById(todoId);

        if (!todo) {
            const error = new Error("could not find todo");
            error.statusCode = 404;
            throw error;
        }

        const result = await Todos.deleteOne({ _id: todoId });

        res.status(200).json({ message: "todo deleted successful", result });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    deleteTodo,
};
