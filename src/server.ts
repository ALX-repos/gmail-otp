import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import gmailRouter from "./routes/gmail";

const app = express();

const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODB_URI || "";

app.use(express.json());

mongoose.connect(URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Connected to DB and Server is running on port ${PORT}`);
  });
});

app.use("/api/gmail", gmailRouter);
