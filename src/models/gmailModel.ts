import { Schema, model, Document } from "mongoose";

export interface IGmail extends Document {
  email: string;
  password: string;
  redirect_email: string;
  redirect_password: string;
  token: string;
  service: {
    name: string;
    filters: string[];
  };
  createdAt: Date;
}

const FilterSchema = new Schema({
  name: String,
  filters: [String],
});

const GmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
  },
  redirect_email: {
    type: String,
    required: true,
    // unique: true,
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

const Gmail = model<IGmail>("Gmail", GmailSchema);

export default Gmail;
