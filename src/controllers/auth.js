const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { generateToken } = require("../utils/validations");

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
        const { email, username, password } = req.validatedData;

        // find user by email or username
        const result = await User.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(username ? [{ username }] : []),
            ],
        });

        // i used 400(bad request) statusCode so an attacker won't have an hint if email, username or password is valid
        if (!result) {
            const error = new Error(
                "Invalid credentials. Login details is incorrect!"
            );
            error.statusCode = 400;
            throw error;
        }

        // compare passwords
        const isEqual = await bcrypt.compare(password, result.password);
        if (!isEqual) {
            const error = new Error(
                "Invalid credentials. Login details is incorrect!"
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

module.exports = {
    signUp,
    logIn,
};
