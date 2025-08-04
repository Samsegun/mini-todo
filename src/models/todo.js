const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const todoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        completed: {
            type: Boolean,
            default: false,
            required: true,
        },
        // creator: {
        //     type: Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true,
        // },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Todos", todoSchema);
