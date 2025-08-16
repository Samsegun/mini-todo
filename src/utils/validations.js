const mongoose = require("mongoose");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

exports.mongoIdValidation = id => {
    return mongoose.Types.ObjectId.isValid(id);
};

exports.generateToken = user => {
    return jwt.sign(
        {
            email: user.email,
            userId: user._id.toString(),
        },
        process.env.JWT_KEY,
        { expiresIn: "2 days" }
    );
};

// validations
exports.createTodoSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    completed: z.boolean().default(false),
    creator: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid id",
    }),
});

exports.updateTodoSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters")
        .optional(),

    description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),

    completed: z.boolean().optional(),
});

exports.createUserSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters"),
    todos: z
        .array(
            z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid todo ID",
            })
        )
        .optional()
        .default([]),
});

exports.signInUserSchema = z
    .object({
        email: z.email("Invalid email format").optional(),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be less than 20 characters")
            .optional(),
        password: z.string(),
    })
    .refine(data => data.email || data.username, {
        message: "Either email or username is required",
        path: ["email"],
    });

// validation middleware
exports.validate = schema => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const error = new Error("Validation failed");
            error.statusCode = 400;
            error.data = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            throw error;
        }

        req.validatedData = result.data;
        next();
    };
};

// for todo creation
exports.validateUserIdAndCreatorId = (req, res, next) => {
    // throw error if creator id does not match user id
    if (req.validatedData.creator !== req.userId) {
        const error = new Error("Can't assign this todo to another user!");
        error.statusCode = 403;
        throw error;
    }

    next();
};
