const { Router } = require("express");
const {
    getTodos,
    createTodo,
    getTodo,
    deleteTodo,
} = require("../controllers/todo");
const { validate, createTodoSchema } = require("../../utils/validations.js");

const todoRouter = Router();

todoRouter.get("/", getTodos);

todoRouter.get("/:id", getTodo);

todoRouter.post("/", validate(createTodoSchema), createTodo);

todoRouter.delete("/:id", deleteTodo);

module.exports = todoRouter;
