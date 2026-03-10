import "dotenv/config";
import nodemailer from "nodemailer";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-NZ', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

const formatTime = (time) => {
  return time.slice(0, 5)
}

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
        <p>Your ${lessonType} is confirmed for ${formatDate(date)} from ${formatTime(startTime)} to ${formatTime(endTime)}<br/>
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
      📅 ${formatDate(slot.date)} — ${formatTime(slot.start_time)} to ${formatTime(slot.end_time)}<br/>
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
  paymentStatus
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
        <p>Unfortunately your ${lessonType} on ${formatDate(date)} at ${formatTime(startTime)} has been cancelled.<br/>
        Reason: ${cancelReason}</br></p>
        ${paymentMessage} </br>
        <a href="${process.env.CLIENT_URL}/lessons">Book another lesson</a>`,
  });
};

// cancellation by client

export const clientCancellationEmail = async (email, name, lessonType, date, startTime) => {
  await transporter.sendMail({
    from: "Wave Coach <ellinor.st@gmail.com>",
    to: email,
    subject: "Booking cancellation confirmed",
    html: `
      <h2>Hi ${name}!</h2>
      <p>Your ${lessonType} on ${formatDate(date)} at ${formatTime(startTime)} has been successfully cancelled.</p>
      ${isMultiple 
        ? `<p>Please contact us to reschedule this session on another available slot.</p>
           <a href="mailto:ellinor.st@gmail.com">Contact us</a>`
        : `<p>We hope to see you back in the water soon!</p>
           <a href="${process.env.CLIENT_URL}/lessons">Book another lesson</a>`
      }
    `,
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
      Email: ${email} <br/>
      Message: ${message}</p>`
  });
};