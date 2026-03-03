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

// verification email for authentification / register
export const sendVerificationMail = async (email, token) => {
  await transporter.sendMail({
    from: "Authentication API <ellinor.st@gmail.com>",
    to: email,
    subject: "Confirm your email",
    html: `<h2> Welcome ${email} ! </h2>
        <p> Thank you for your registration. Please click the link below to verify your email.</p> <br/>
        <a href="${process.env.CLIENT_URL}/api/auth/verify?token=${token}">Verify my email</a>
        `,
  });
};
// reset password
export const sendResetPasswordEmail = async (email, token) => {
  await transporter.sendMail({
    from: "Verification API  <ellinor.st@gmail.com>",
    to: email,
    subject: "Reset password",
    html: `<h2>   Hi ${email} ! </h2>
        <p> Click the link to reset your password: </p> <br/>
        <a href="${process.env.CLIENT_URL}/api/auth/reset-password?token=${token}">reset my password</a>`,
  });
};

// booking confirmation

export const bookingConfirmationEmail = async (name, email, lessonType, date, startTime, endTime) => {
  await transporter.sendMail({
    from: "Wave Coach <ellinor.st@gmail.com>",
    to: email,
    subject: "Booking confirmation",
    html: `<h2>   Hi ${name} ! </h2>
        <p>Your ${lessonType} is confirmed for ${date} from ${startTime} to ${endTime}<br/>
        Need to cancel ?</p> 
        <a href="#">please follow this link</a>`,
  });
};