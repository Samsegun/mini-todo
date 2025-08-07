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

    updateTodoSchema,
    validateUserIdAndCreatorId,
} = require("../../utils/validations.js");

const todoRouter = Router();

todoRouter.get("/", getTodos);

todoRouter.get("/:id", getTodo);

todoRouter.post(
    "/",
    validate(createTodoSchema),
    validateUserIdAndCreatorId,
    createTodo
);

todoRouter.put("/:id", validate(updateTodoSchema), updateTodo);

todoRouter.delete("/:id", deleteTodo);

module.exports = todoRouter;
