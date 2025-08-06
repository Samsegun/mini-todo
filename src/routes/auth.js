const { Router } = require("express");
const {
    validate,
    createUserSchema,
    signInUserSchema,
} = require("../../utils/validations");
const { signUp, logIn } = require("../controllers/auth");

const authRouter = Router();

authRouter.post("/signup", validate(createUserSchema), signUp);
authRouter.post("/login", validate(signInUserSchema), logIn);

module.exports = authRouter;
