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
exports.getOtpFromEmail = exports.generateToken = void 0;
const crypto_1 = require("crypto");
const imap_simple_1 = __importDefault(require("imap-simple"));
const generateToken = (prefix, length) => {
    const bytes = (0, crypto_1.randomBytes)(length / 2); // 32 hex chars = 16 bytes
    return prefix + bytes.toString("hex");
};
exports.generateToken = generateToken;
const getOtpFromEmail = (user, password, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = {
            imap: {
                user,
                password,
                // host: "imap.rambler.ru",
                host: "imap.firstmail.ltd",
                port: 993,
                tls: true,
                authTimeout: 3000,
                // tlsOptions: {
                //   rejectUnauthorized: false, // ⚠️ use only if absolutely necessary
                // },
            },
        };
        // console.log(config);
        // Connect to the IMAP server
        const connection = yield imap_simple_1.default.connect(config);
        // console.log("Connected to IMAP server");
        // Open the inbox
        yield connection.openBox("INBOX");
        // console.log("Opened INBOX");
        // Search for all messages
        const messages = yield connection.search(["ALL"], {
            bodies: ["HEADER.FIELDS (FROM)", "TEXT"],
            struct: true,
        });
        let otp = "";
        // Process each message
        for (const message of messages.reverse()) {
            const header = message.parts.find((part) => part.which === "HEADER.FIELDS (FROM)");
            const body = message.parts.find((part) => part.which === "TEXT");
            console.log(header === null || header === void 0 ? void 0 : header.body);
            if (header && body) {
                const fromAddress = header.body.from[0];
                if (fromAddress) {
                    const isAppleMessage = filters.some((filter) => fromAddress.includes(filter));
                    if (isAppleMessage) {
                        const bodyText = body.body.toString();
                        const verificationCodeMatch = bodyText.match(/(?<=\s)\d{4,6}(?=\s)(?!.*\b\d{4,6}\b)/);
                        if (verificationCodeMatch) {
                            // console.log("\n=== Apple Verification Code ===");
                            // console.log("From:", fromAddress);
                            console.log("Verification Code:", verificationCodeMatch[0]);
                            // console.log("========================\n");
                            otp = verificationCodeMatch[0];
                            break;
                        }
                    }
                }
            }
        }
        // Close the connection
        connection.end();
        // console.log("Connection closed");
        return otp;
    }
    catch (error) {
        console.error("Error:", error);
        throw new Error("Error getting OTP from email");
    }
});
exports.getOtpFromEmail = getOtpFromEmail;
