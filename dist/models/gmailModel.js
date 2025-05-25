"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FilterSchema = new mongoose_1.Schema({
    name: String,
    filters: [String],
});
const GmailSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    redirect_email: {
        type: String,
        required: true,
        unique: true,
    },
    redirect_password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    service: {
        type: FilterSchema,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});
const Gmail = (0, mongoose_1.model)("Gmail", GmailSchema);
exports.default = Gmail;
