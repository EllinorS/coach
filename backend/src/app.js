import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import {errorHandler} from "./middlewares/errorHandler.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { roleMiddleware } from "./middlewares/role.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import lessonTypeRoutes from "./routes/lessonType.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import tripRoutes from "./routes/tripRequest.routes.js";
import contactRoutes from "./routes/contact.routes.js"
import userRoutes from "./routes/users.routes.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/lesson-types", lessonTypeRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/content", siteContentRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/trip-request", tripRoutes);

app.use("/api/admin/users", authMiddleware, roleMiddleware("SUPER_ADMIN"), userRoutes);
app.use("/api/admin/lessons", authMiddleware, roleMiddleware("SUPER_ADMIN"), lessonRoutes);
app.use("/api/admin/lesson-types", authMiddleware, roleMiddleware("SUPER_ADMIN"), lessonTypeRoutes);
app.use("/api/admin/slots", authMiddleware, roleMiddleware("SUPER_ADMIN"), slotRoutes);
app.use("/api/admin/bookings", authMiddleware, roleMiddleware("SUPER_ADMIN"), bookingRoutes);
app.use("/api/admin/payments", authMiddleware, roleMiddleware("SUPER_ADMIN"), paymentRoutes);
app.use("/api/admin/trip-requests", authMiddleware, roleMiddleware("SUPER_ADMIN"), tripRoutes);
app.use("/api/admin/quiz", authMiddleware, roleMiddleware("SUPER_ADMIN"), quizRoutes);
app.use("/api/admin/reviews", authMiddleware, roleMiddleware("SUPER_ADMIN"), reviewRoutes);
app.use("/api/admin/media", authMiddleware, roleMiddleware("SUPER_ADMIN"), mediaRoutes);
app.use("/api/admin/content", authMiddleware, roleMiddleware("SUPER_ADMIN"), siteContentRoutes);
app.use("/api/admin/contact", authMiddleware, roleMiddleware("SUPER_ADMIN"), contactRoutes);

app.use(errorHandler);

export default app