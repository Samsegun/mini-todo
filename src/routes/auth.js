const { Router } = require("express");
const {
    validate,
    createUserSchema,
    signInUserSchema,
} = require("../../utils/validations");
const { signUp, signIn } = require("../controllers/auth");

const authRouter = Router();

authRouter.post("/signup", validate(createUserSchema), signUp);
authRouter.post("/signup", validate(signInUserSchema), signIn);

module.exports = authRouter;
