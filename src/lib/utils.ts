import { randomBytes } from "crypto";
import ImapSimple, { ImapSimpleOptions } from "imap-simple";

export const generateToken = (prefix: string, length: number) => {
  const bytes = randomBytes(length / 2); // 32 hex chars = 16 bytes
  return prefix + bytes.toString("hex");
};

export const getOtpFromEmail = async (
  user: string,
  password: string,
  filters: string[]
) => {
  try {
    const config: ImapSimpleOptions = {
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
    const connection = await ImapSimple.connect(config);
    // console.log("Connected to IMAP server");

    // Open the inbox
    await connection.openBox("INBOX");
    // console.log("Opened INBOX");

    // Search for all messages
    const messages = await connection.search(["ALL"], {
      bodies: ["HEADER.FIELDS (FROM)", "TEXT"],
      struct: true,
    });

    let otp = "";

    // Process each message
    for (const message of messages.reverse()) {
      const header = message.parts.find(
        (part) => part.which === "HEADER.FIELDS (FROM)"
      );
      const body = message.parts.find((part) => part.which === "TEXT");

      console.log(header?.body);

      if (header && body) {
        const fromAddress: string = header.body.from[0];

        if (fromAddress) {
          const isAppleMessage = filters.some((filter) =>
            fromAddress.includes(filter)
          );

          if (isAppleMessage) {
            const bodyText = body.body.toString();
            const verificationCodeMatch = bodyText.match(
              /(?<=\s)\d{4,6}(?=\s)(?!.*\b\d{4,6}\b)/
            );

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
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error getting OTP from email");
  }
};
