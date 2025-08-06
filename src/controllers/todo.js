const Todos = require("../models/todo");
const { mongoIdValidation } = require("../../utils/validations.js");
const User = require("../models/user");

async function getTodos(req, res, next) {
    try {
        const todos = await Todos.find({ creator: req.userId }, { __v: 0 });

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

        // todo: if entered todoId is not in user's todo list throw error
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

        // update user todo array with newly created todo
        const userId = req.userId;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { todos: result._id } },
            { new: true }
        ).select("_id email");

        // if user update fails, delete the created todo
        if (!updatedUser) {
            await Todos.findByIdAndDelete(result._id);
            const error = new Error("Failed to update user with new todo");
            throw error;
        }

        const { _id, title, completed, creator } = result;

        res.status(201).json({
            message: "todo created successful",
            todo: { _id, title, completed, creator },
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
            },
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
