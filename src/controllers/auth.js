const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { generateToken, mongoIdValidation } = require("../utils/validations");

async function signUp(req, res, next) {
    try {
        const { email, password, username } = req.validatedData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            const error = new Error("user already exists");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            const error = new Error("Server error");
            throw error;
        }

        const result = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        if (!result) {
            const error = new Error("Failed to create user");
            throw error;
        }

        const token = generateToken(result);
        const userResponse = {
            _id: result._id,
            email: result.email,
            username: result.username,
            createdAt: result.createdAt,
        };

        res.status(201).json({
            message: "user created and log in successfull!",
            user: userResponse,
            token,
        });
    } catch (error) {
        next(error);
    }
}

async function logIn(req, res, next) {
    try {
        const { emailUsername, password } = req.validatedData;

        const result = await User.findOne({
            $or: [{ email: emailUsername }, { username: emailUsername }],
        });

        if (!result) {
            const error = new Error(
                "Invalid credentials. Please check login details!"
            );
            error.statusCode = 400;
            throw error;
        }

        // compare passwords
        const isEqual = await bcrypt.compare(password, result.password);
        if (!isEqual) {
            const error = new Error(
                "Invalid credentials. Please check login details!"
            );
            error.statusCode = 400;
            throw error;
        }

        const token = generateToken(result);
        const userResponse = {
            _id: result._id,
            email: result.email,
            username: result.username,
        };

        res.status(200).json({
            message: "user log in successfull!",
            token: token,
            user: userResponse,
        });
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    const userId = req.params.userId;

    try {
        if (!mongoIdValidation(userId)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        //fetch user
        let user = await User.findById(userId);
        if (!user) {
            const error = new Error("Could not find user");
            error.statusCode = 404;
            throw error;
        }

        // compare user id with logged in user
        if (user._id.toString() !== req.userId) {
            const error = new Error("Can't update user!!!");
            error.statusCode = 403;
            throw error;
        }

        // update todo
        Object.assign(user, req.validatedData);

        const updatedUser = await user.save();

        if (!updatedUser) {
            const error = new Error("Failed to update user");
            throw error;
        }

        const { _id, email, username, updatedAt } = updatedUser;

        res.status(200).json({
            message: "user updated successful",
            updatedUser: {
                _id,
                email,
                username,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signUp,
    logIn,
    updateUser,
};
