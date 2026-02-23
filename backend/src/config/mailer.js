import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP error", err.message);
  else console.log("SMTP connected");
});

export const sendVerificationMail = async (email, token) => {
  await transporter.sendMail({
    from: "Authentication API <ellinor.st@gmail.com>",
    to: email,
    subject: "Confirm your email",
    html: `<h2> Welcome ${email} ! </h2>
        <p> Thank you for your registration. Please click the link below to verify your email.</p> <br/>
        <a href="http://localhost:3000/api/auth/verify?token=${token}">Verify my email</a>
        `,
  });
};

export const sendResetPasswordEmail = async (email, token) => {
  await transporter.sendMail({
    from: "Verification API  <ellinor.st@gmail.com>",
    to: email,
    subject: "Reset password",
    html: `<h2>   Bienvenue ${email} ! </h2>
        <p> Click the link to reset your password: </p> <br/>
        <a href="http://localhost:3000/api/auth/reset-password-request?token=${token}">reset my password</a>`,
  });
};

