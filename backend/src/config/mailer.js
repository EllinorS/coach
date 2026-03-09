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

export const bookingConfirmationEmail = async (
  name,
  email,
  lessonType,
  date,
  startTime,
  endTime,
  cancelToken,
) => {
  await transporter.sendMail({
    from: "Wave Coach <ellinor.st@gmail.com>",
    to: email,
    subject: "Booking confirmation",
    html: `<h2>   Hi ${name} ! </h2>
        <p>Your ${lessonType} is confirmed for ${date} from ${startTime} to ${endTime}<br/>
        Need to cancel this?</p> 
        <a href="${process.env.CLIENT_URL}/cancel?token=${cancelToken}">Please follow this link</a>`,
  });
};

// multiple bookings confirmationn

export const multipleBookingConfirmationEmail = async (
  name,
  email,
  slots,
  cancelTokens,
) => {

    const slotsList = slots.map((slot, index) => `
    <p>
      📅 ${slot.date} — ${slot.start_time} to ${slot.end_time}<br/>
      <a href="${process.env.CLIENT_URL}/cancel?token=${cancelTokens[index]}">Cancel this session</a>
    </p>
  `).join("")

  await transporter.sendMail({
    from: "Wave Coach <ellinor.st@gmail.com>",
    to: email,
    subject: "Booking confirmation",
    html: `<h2>   Hi ${name} ! </h2>
        <p>Your bookings are confirmed:<br/>
        ${slotsList}
        Need to cancel this?</p> `
  });
};

// slot cancellation

export const cancellationEmail = async (
  email,
  name,
  lessonType,
  date,
  startTime,
  cancelReason,
) => {
  let paymentMessage = "";

  if (paymentStatus === "UNPAID") {
    paymentMessage = `<p>As no payment had been made, there is nothing to worry about on that front!</p>`;
  } else if (paymentStatus === "DEPOSIT_PAID") {
    paymentMessage = `<p>Your deposit will be fully refunded within the next few days. We apologize for the inconvenience!</p>`;
  } else if (paymentStatus === "FULLY_PAID") {
    paymentMessage = `<p>Your payment will be fully refunded within the next few days. We're sorry for the disruption to your plans!</p>`;
  }

  await transporter.sendMail({
    from: "Wave Coach <ellinor.st@gmail.com>",
    to: email,
    subject: "Booking cancellation",
    html: `<h2>   Hi ${name} ! </h2>
        <p>Unfortunately your ${lessonType} on ${date} at ${startTime} has been cancelled.<br/>
        Reason: ${cancelReason}</br></p>
        ${paymentMessage} </br>
        <a href="${process.env.CLIENT_URL}/lessons">Book another lesson</a>`,
  });
};

// contact form message

export const newContactEmail = async (
    firstName,
    lastName,
    email,
    phone,
    subject,
    message,
) => {
  await transporter.sendMail({
    from: `Wave Coach <ellinor.st@gmail.com>`,
    replyTo: `${email}`,
    to: "ellinor.st@gmail.com",
    subject: `New message - ${subject}`,
    html: `
    <p>First name : ${firstName}<br/>
      Last name : ${lastName}<br/>
      Phone: ${phone}<br/>
      Message: ${message}</p>`
  });
};