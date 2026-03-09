import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import {errorHandler} from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import lessonTypeRoutes from "./routes/lessonType.routes.js";
import mediaRoutes from "./routes/media.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import quizRoutes from "./routes/quiz.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import slotRoutes from "./routes/slot.routes.js";
// import tripRoutes from "./routes/tripRequest.routes.js";
import contactRoutes from "./routes/contact.routes.js"
// import userRoutes from "./routes/users.routes.js";

const app = express();
// secure http headers
//crossorigin : 
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// authorize requests coming from the front-end and allow cookies and authentication headers to be sent

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);
// Allows Express to read JSON sent in request bodies
app.use(express.json());

// Limits the number of requests per IP to prevent brute force attacks

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

// Serves uploaded files as static files, accessible from the frontend

app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

 // routes

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/lesson-types", lessonTypeRoutes);
app.use("/api/media", mediaRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/quiz", quizRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/content", siteContentRoutes);
app.use("/api/slots", slotRoutes);
// app.use("/api/trip-request", tripRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorHandler);

export default app