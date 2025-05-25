"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const gmail_1 = __importDefault(require("./routes/gmail"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODB_URI || "";
app.use(express_1.default.json());
mongoose_1.default.connect(URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Connected to DB and Server is running on port ${PORT}`);
    });
});
app.use("/api/gmail", gmail_1.default);
