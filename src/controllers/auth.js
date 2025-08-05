const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function signUp(req, res, next) {
    try {
        const { email, password, username } = req.validatedData;
        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            const error = new Error("Server error");
            throw error;
        }

        const query = User.where({ email });
        const userExists = await query.findOne();

        if (userExists) {
            const error = new Error("user already exists");
            error.statusCode = 400;
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

        res.status(201).json({ message: "user created!", result });
    } catch (error) {
        next(error);
    }
}

async function signIn(req, res, next) {
    // try {
    //     const { email, password } = req.body;
    //     const result = await User.findOne({ email: email });
    //     if (!result) {
    //         const error = new Error("User not found!");
    //         error.statusCode = 404;
    //         throw error;
    //     }
    //     const isEqual = await bcrypt.compare(password, result.password);
    //     if (!isEqual) {
    //         const error = new Error("Incorrect password!");
    //         error.statusCode = 401;
    //         throw error;
    //     }
    //     const token = jwt.sign(
    //         {
    //             email: result.email,
    //             userId: result._id.toString(),
    //         },
    //         process.env.JWT_KEY,
    //         { expiresIn: "1h" }
    //     );
    //     res.status(200).json({ token: token, userId: result._id.toString() });
    // } catch (error) {
    //     next(error);
    // }
}

module.exports = {
    signUp,
    signIn,
};
