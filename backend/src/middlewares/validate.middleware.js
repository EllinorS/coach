import { z } from "zod";

// register

export const registerSchema = (req, res, next) => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });
  try {
    schema.parse(req.body);
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: `Passwords don't match` });
    }

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// login

export const loginSchema = (req, res, next) => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  try {
    schema.parse(req.body);

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// reset password request

export const resetPasswordRequestSchema = (req, res, next) => {
  const schema = z.object({
    email: z.email("Email not valid"),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};
// reset password
export const resetPasswordSchema = (req, res, next) => {
  const schema = z.object({
    token: z.string(),
    password: z.string().min(6),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// create media
export const createMediaSchema = (req, res, next) => {
  const schema = z.object({
    alt: z.string().max(255).optional(),
    folder: z.string().max(255).optional(),
    lessonId: z.number().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// create lesson type

export const createLessonTypeSchema = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// create lesson

export const createLessonSchema = (req, res, next) => {
  const schema = z.object({
    lessonTypeId: z.number(),
    linkedLessonId: z.number().optional().nullable(),
    type: z.enum(["SINGLE", "MULTIPLE"]).optional(),
    sessionsCount: z.number().optional(),
    title: z.string().min(3).max(255),
    description: z.string().min(10),
    shortDesc: z.string().min(1).max(500),
    price: z.number(),
    depositAmount: z.number(),
    durationMin: z.number(),
    maxParticipants: z.number(),
    level: z.enum(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// create slots

export const createSlotSchema = (req, res, next) => {
  const schema = z.object({
    lessonId: z.number(),
    date: z.iso.date(),
    startTime: z.iso.time(),
    endTime: z.iso.time(),
    spotsTotal: z.number(),
    isCancelled: z.boolean().optional(),
    cancelReason: z.string().max(500).optional(),
    notes: z.string().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

//create booking

export const createBookingSchema = (req, res, next) => {
  const schema = z.object({
    slotId: z.number(),
    clientName: z.string().max(255),
    email: z.email(),
    phone: z.string().max(50).optional(),
    country: z.string().max(100).optional(),
    nbParticipants: z.number(),
    bookingStatus: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
    cancelReason: z.string().max(500).optional(),
    notes: z.string().optional(),
    internalNotes: z.string().optional(),
    paymentStatus: z
      .enum(["UNPAID", "DEPOSIT_PAID", "FULLY_PAID", "REFUNDED"])
      .optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

//create multiple booking

export const createMultipleBookingSchema = (req, res, next) => {
  const schema = z.object({
    lessonId: z.number(),
    slotIds: z.array(z.number()).min(1),
    clientName: z.string().max(255),
    email: z.email(),
    phone: z.string().max(50).optional(),
    country: z.string().max(100).optional(),
    nbParticipants: z.number(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// reviews

export const createReviewsSchema = (req, res, next) => {
  const schema = z.object({
    clientName: z.string().max(255),
    country: z.string().max(100).optional(),
    content: z.string(),
    rating: z.number().int().min(1).max(5),
    productType: z.enum(["LESSON", "COACHING", "TRIP", "GENERAL"]),
    reviewDate: z.iso.date().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// update site content
export const createContentSchema = (req, res, next) => {
  const schema = z.object({
    value: z.string().optional(),
    mediaId: z.number().optional(),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// create contact

export const createContactSchema = (req, res, next) => {
  const schema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100).optional(),
    email: z.email(),
    phone: z.string().max(50).optional(),
    subject: z.string().max(255).optional(),
    message: z.string().min(3).max(500),
  });
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
};

// update contact
export const updateContactSchema = (req, res, next) => {
  const schema = z.object({
    status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  })
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ message: error.issues.map(err => err.message).join(", ") })
  }
}