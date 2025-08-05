const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        // todos: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Todos",
        //     },
        // ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
