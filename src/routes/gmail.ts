import { Router } from "express";
import {
  generateTokens,
  getOtp,
  getTokens,
} from "../controllers/gmailController";

const router = Router();

router.get("/get-tokens", getTokens);

router.post("/generate-tokens", generateTokens);

router.get("/get-otp", getOtp);

export default router;
