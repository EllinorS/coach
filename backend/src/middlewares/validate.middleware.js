import { z } from "zod";

// register

export const registerSchema = (req, res, next) => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
  });
  try {
    schema.parse(req.body);
    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ message: `Passwords don't match` });
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
    password: z.string().min(6)
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
    lessonId: z.number().optional()
  })
    try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
}

// create lesson type

export const createLessonTypeSchema = (req, res, next) => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    slug : z.string().min(1).max(100),
    description: z.string().max(500).optional()
  })
    try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.issues.map((err) => err.message).join(", ") });
  }
}

// create lesson

export const createLesson = (req, res, next) =>{
  const schema = z.object({
    lessonTypeId: z.number(),
    title: z.string().min(3),
    description: z.,
    shortDesc: z.,
    price: z.,
    depositAmount: z.,
    durationMin: z.,
    maxParticipants: z.,
    level: z.,
  })
}