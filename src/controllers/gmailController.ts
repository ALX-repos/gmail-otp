import { Request, Response } from "express";

import Gmail from "../models/gmailModel";
import { generateToken, getOtpFromEmail } from "../lib/utils";
import { type GenerateTokensBodyProps, type GetOTPQueryProps } from "../types";

export const getTokens = async (req: Request, res: Response) => {
  try {
    const tokens = await Gmail.find();
    const data = tokens.map((gmail) => {
      return {
        email: gmail.email,
        token: gmail.token,
      };
    });

    res
      .status(200)
      .json({ message: "Tokens fetched successfully", tokens: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateTokens = async (
  req: Request<{}, {}, GenerateTokensBodyProps>,
  res: Response
) => {
  try {
    const { accounts } = req.body;
    if (!accounts || accounts.length === 0) {
      res.status(400).json({ message: "No accounts provided" });
      return;
    }

    // const isUnique = await Promise.all(
    //   accounts.map(async (account) => {
    //     const existingAccount = await Gmail.findOne({
    //       $or: [
    //         { email: account.email },
    //         { redirect_email: account.redirect_email },
    //       ],
    //     });
    //     return !existingAccount;
    //   })
    // ).then((results) => results.every((result) => result));

    // if (!isUnique) {
    //   res.status(400).json({ message: "Some accounts already exist" });
    //   return;
    // }

    const tokensPromise = accounts.map(async (account) => {
      while (true) {
        const token = generateToken(account.service.name.slice(0, 2), 32);
        const existingToken = await Gmail.findOne({ token });
        if (!existingToken) {
          return {
            ...account,
            token,
          };
        }
      }
    });

    const tokens = await Promise.all(tokensPromise);
    const gmail_tokens = await Gmail.insertMany(tokens);

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOtp = async (
  req: Request<{}, {}, {}, GetOTPQueryProps>,
  res: Response
) => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return;
    }

    const gmail = await Gmail.findOne({ token });
    if (!gmail) {
      res.status(404).json({ message: "Invalid Token" });
      return;
    }

    const otp = await getOtpFromEmail(
      gmail.redirect_email.trim(),
      gmail.redirect_password.trim(),
      gmail.service.filters
    );

    if (!otp) {
      res.status(404).json({ message: "OTP not found" });
      return;
    }

    res.status(200).json({ message: "OTP found", otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
