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

        const todo = await Todos.findOne(
            { _id: todoId, creator: req.userId },
            { __v: 0 }
        );

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
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userId },
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
            message: "todo created!",
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

async function updateTodo(req, res, next) {
    const todoId = req.params.id;

    try {
        if (!mongoIdValidation(todoId)) {
            const error = new Error("Invalid todo ID");
            error.statusCode = 400;
            throw error;
        }

        //fetch post
        let todo = await Todos.findById(todoId);
        if (!todo) {
            const error = new Error("Could not find todo");
            error.statusCode = 404;
            throw error;
        }

        // compare creator id with logged in user
        if (todo.creator.toString() !== req.userId) {
            const error = new Error("Can't update todo for another user");
            error.statusCode = 403;
            throw error;
        }

        // update todo
        Object.assign(todo, req.validatedData);

        const updatedTodo = await todo.save();

        if (!updatedTodo) {
            const error = new Error("Failed to update todo");
            throw error;
        }

        res.status(200).json({
            message: "todo updated successful",
            updatedTodo,
        });
    } catch (error) {
        next(error);
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

        const todoToBeRemoved = await Todos.findById(todoId);
        if (!todoToBeRemoved) {
            const error = new Error("Could not find todo");
            error.statusCode = 404;
            throw error;
        }

        if (todoToBeRemoved.creator.toString() !== req.userId) {
            const error = new Error("Can't delete todo for another user");
            error.statusCode = 403;
            throw error;
        }

        const deletedResult = await Todos.deleteOne({ _id: todoId });
        if (!deletedResult.acknowledged) {
            const error = new Error("Failed to delete");
            throw error;
        }

        // remove from user's todo array
        await User.findByIdAndUpdate(
            { _id: req.userId },
            { $pull: { todos: todoId } }
        );

        res.status(200).json({
            message: "todo deleted successful",
            deletedResult,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
};
