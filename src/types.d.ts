import { IGmail } from "./models/gmailModel";

declare interface GenerateTokensBodyProps {
  accounts: {
    email: string;
    password?: string;
    redirect_email: string;
    redirect_password: string;
    service: {
      name: string;
      filters: string[];
    };
  }[];
}

declare interface GetOTPQueryProps {
  token: string;
}
