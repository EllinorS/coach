import "dotenv/config";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { v4 as uuid4 } from "uuid";
import * as authModel from "../models/auth.model.js";
import * as mediaModel from "../models/media.model.js"
import {
  sendVerificationMail,
  sendResetPasswordEmail,
} from "../config/mailer.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

// Register

export const register = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: `Passwords don't match.` });
  }

  const existing = await authModel.findUserByEmail(email);
  if (existing)
    return res.status(400).json({ message: "Email exists already" });

  const passwordHash = await argon2.hash(password);
  const verifyToken = uuid4();
  const role = await authModel.findRoleByName("COACH");

  let avatarMediaId = null;

  if (req.file) {
    avatarMediaId = await mediaModel.createMedia(
      req.file.filename,
      `/uploads/${req.file.filename}`,
      "avatars",
      req.file.mimetype,
      req.file.size,
      null,
    );
  }

  await authModel.createUser(
    role.id,
    email,
    passwordHash,
    firstName,
    lastName,
    verifyToken,
    avatarMediaId,
  );
  await sendVerificationMail(email, verifyToken);
  res
    .status(201)
    .json({ message: "Account created, please verify your email" });
});

// Email verification

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const user = await authModel.findUserByVerifyToken(token);
  if (!user) return res.status(400).json({ message: "Invalid token" });
  await authModel.verifyUser(user.id);
  res.status(200).json({ message: "Email verified. You can now login" });
});

// Login

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Incorrect email or password" });
  }
  if (!user.is_verified) {
    return res
      .status(403)
      .json({ message: "Account not verified, please check your emails" });
  }
  if (!user.is_active) {
    return res.status(403).json({ message: "Account disabled" });
  }

  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    return res.status(400).json({ message: "Incorrect email or password" });
  }

  await authModel.updateLastLogin(user.id);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      role: user.role,
    },
  });
});

// ResetPassword Request

export const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await authModel.findUserByEmail(email);
  if (!user)
    return res
      .status(200)
      .json({ message: "If this email exists, a reset link has been sent." });
  const resetToken = uuid4();
  await authModel.saveResetPassword(user.id, resetToken);
  await sendResetPasswordEmail(email, resetToken);
  res
    .status(200)
    .json({ message: "If this email exists, a reset link has been sent." });
});

// Reset password

export const resetPassword = asyncHandler(async (req, res) => {

  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: `Passwords don't match.` });
  }

  const user = await authModel.findUserByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  const passwordHash = await argon2.hash(password);
  await authModel.updatePassword(user.id, passwordHash);
  await authModel.clearResetToken(user.id)

  res.status(200).json({ message: "Password reset successfully." });
});
