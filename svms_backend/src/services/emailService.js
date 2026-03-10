import { transporter } from "../config/mailer.js";
import { verifyEmailTemplate } from "../views/templates/verifyEmailTemplate.js";

export const sendVerificationEmail = async (email, link) => {
  await transporter.sendMail({
    from: `"Smart Village Management Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your Email - Smart Village Management System",
    html: verifyEmailTemplate(link),
  });
};
