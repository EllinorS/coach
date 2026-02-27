import express from "express";
import {
  login,
  register,
  resetPassword,
  resetPasswordRequest,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import {
  registerSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../middlewares/validate.middleware.js";
import {upload} from '../middlewares/upload.middleware.js'

const router = express.Router();

router.post("/register", upload.single('avatar'),registerSchema, register);
router.post("/login", loginSchema, login);
router.get("/verify", verifyEmail);
router.post(
  "/reset-password-request",
  resetPasswordRequestSchema,
  resetPasswordRequest,
);
router.post("/reset-password", resetPasswordSchema, resetPassword);
router.post("/logout", authMiddleware);

export default router;
