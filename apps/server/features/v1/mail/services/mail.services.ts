import nodemailer, { SendMailOptions } from "nodemailer";
import serverConfig from "../../../../config/server.config";
import { generalLogger } from "../../../../lib/logger";

export const createTestEmailFromEtheral = async () => {
  // For Creating New Testing Email
  // From mail@etheral.com
  const creds = await nodemailer.createTestAccount();
  return creds;
};

/**
 * ==============
 * Example Email
 * ==============
 * @example
 * {
 *    from: '"Fred Foo 👻" <foo@example.com>',
 *    to: "bar@example.com, baz@example.com",
 *    subject: "Hello ✔",
 *    text: "Hello world?",
 *    html: "<b>Hello world?</b>",
 * }
 */
export const sendEmail = async (payload: SendMailOptions) => {
  try {
    const { host, port, secure, user, password } = serverConfig.emailOptions;
    const isGettingAllInfo = !!host && !!port && !!user && !!password;
    if (!isGettingAllInfo) return;

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: password,
      },
    });
    
    console.log("serverConfig.emailOptions", serverConfig.emailOptions);
    const info = await transporter.sendMail(payload);
    const messageId = info.messageId;
    console.log("Message Id: " + messageId);
    console.log("Test Message Url:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    const stack = err instanceof Error ? err.stack : "";
    generalLogger.info(`Email Error: ${message}`, { stack });
  }
};
