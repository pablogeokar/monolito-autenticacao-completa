import { config } from "../config/app.config";
import { resend } from "./resendClient";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

const mailer_sender =
  config.NODE_ENV === "development"
    ? "no-reply <test@resend.dev>"
    : `no-reply <${config.MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  text,
  html,
}: Params) => {
  await resend.emails.send({
    to: Array.isArray(to) ? to : [to],
    from,
    text,
    subject,
    html,
  });
};
