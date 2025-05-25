"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtp = exports.generateTokens = exports.getTokens = void 0;
const gmailModel_1 = __importDefault(require("../models/gmailModel"));
const utils_1 = require("../lib/utils");
const getTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield gmailModel_1.default.find();
        const data = tokens.map((gmail) => {
            return {
                email: gmail.email,
                token: gmail.token,
            };
        });
        res
            .status(200)
            .json({ message: "Tokens fetched successfully", tokens: data });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTokens = getTokens;
const generateTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accounts } = req.body;
        if (!accounts || accounts.length === 0) {
            res.status(400).json({ message: "No accounts provided" });
            return;
        }
        const isUnique = yield Promise.all(accounts.map((account) => __awaiter(void 0, void 0, void 0, function* () {
            const existingAccount = yield gmailModel_1.default.findOne({
                $or: [
                    { email: account.email },
                    { redirect_email: account.redirect_email },
                ],
            });
            return !existingAccount;
        }))).then((results) => results.every((result) => result));
        if (!isUnique) {
            res.status(400).json({ message: "Some accounts already exist" });
            return;
        }
        const tokensPromise = accounts.map((account) => __awaiter(void 0, void 0, void 0, function* () {
            while (true) {
                const token = (0, utils_1.generateToken)(account.service.name.slice(0, 2), 32);
                const existingToken = yield gmailModel_1.default.findOne({ token });
                if (!existingToken) {
                    return Object.assign(Object.assign({}, account), { token });
                }
            }
        }));
        const tokens = yield Promise.all(tokensPromise);
        const gmail_tokens = yield gmailModel_1.default.insertMany(tokens);
        const data = gmail_tokens.map((gmail) => {
            return {
                email: gmail.email,
                token: gmail.token,
            };
        });
        res.status(201).json({
            message: "Tokens generated successfully",
            tokens: data,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateTokens = generateTokens;
const getOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token) {
            res.status(400).json({ message: "Token is required" });
            return;
        }
        const gmail = yield gmailModel_1.default.findOne({ token });
        if (!gmail) {
            res.status(404).json({ message: "Invalid Token" });
            return;
        }
        const otp = yield (0, utils_1.getOtpFromEmail)(gmail.redirect_email.trim(), gmail.redirect_password.trim(), gmail.service.filters);
        if (!otp) {
            res.status(404).json({ message: "OTP not found" });
            return;
        }
        res.status(200).json({ message: "OTP found", otp });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOtp = getOtp;
