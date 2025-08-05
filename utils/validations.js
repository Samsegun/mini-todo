const mongoose = require("mongoose");
const { z } = require("zod");

exports.mongoIdValidation = id => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Usage
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
    // creator: z
    //     .string()
    //     .refine(val => mongoIdValidation(val), { message: "Invalid id" }),
});

exports.createUserSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Name must be less than 20 characters"),
    // creator: z
    //     .string()
    //     .refine(val => mongoIdValidation(val), { message: "Invalid id" }),
});

exports.signInUserSchema = z.object({
    email: z.email("Invalid email format").optional(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Name must be less than 20 characters")
        .optional(),
    password: z.string(),
});

// Validation middleware
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
