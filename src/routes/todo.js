const { Router } = require("express");
const {
    getTodos,
    createTodo,
    getTodo,
    deleteTodo,
    updateTodo,
} = require("../controllers/todo");
const {
    validate,
    createTodoSchema,
    validateUserAndCreator,
} = require("../../utils/validations.js");

const todoRouter = Router();

todoRouter.get("/", getTodos);

todoRouter.get("/:id", getTodo);

todoRouter.post(
    "/",
    validate(createTodoSchema),
    validateUserAndCreator,
    createTodo
);

todoRouter.put(
    "/:id",
    validate(createTodoSchema),
    validateUserAndCreator,
    updateTodo
);

todoRouter.delete("/:id", deleteTodo);

module.exports = todoRouter;
