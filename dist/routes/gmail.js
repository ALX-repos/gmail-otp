"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gmailController_1 = require("../controllers/gmailController");
const router = (0, express_1.Router)();
router.get("/get-tokens", gmailController_1.getTokens);
router.post("/generate-tokens", gmailController_1.generateTokens);
router.get("/get-otp", gmailController_1.getOtp);
exports.default = router;
