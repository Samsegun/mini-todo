const { Router } = require("express");
const {
    validate,
    createUserSchema,
    signInUserSchema,
    updateUserSchema,
} = require("../utils/validations");
const { signUp, logIn, updateUser } = require("../controllers/auth");
const protected = require("../middleware/auth");

const authRouter = Router();

authRouter.post("/signup", validate(createUserSchema), signUp);
authRouter.post("/login", validate(signInUserSchema), logIn);
authRouter.put(
    "/update/:userId",
    protected,
    validate(updateUserSchema),
    updateUser
);
// authRouter.post("/logout", logIn);

module.exports = authRouter;
