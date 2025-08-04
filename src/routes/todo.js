const { Router } = require("express");
const { getTodos, createTodo, getTodo } = require("../controllers/todo");

const todoRouter = Router();

todoRouter.get("/", getTodos);

todoRouter.get("/:id", getTodo);

todoRouter.post("/", createTodo);

module.exports = todoRouter;
