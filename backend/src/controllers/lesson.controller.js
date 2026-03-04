import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as lessonModel from "../models/lesson.model.js";

// create lesson

export const createLesson = asyncHandler(async (req, res) => {
  const {
    lessonTypeId,
    title,
    description,
    shortDesc,
    price,
    depositAmount,
    durationMin,
    maxParticipants,
    level,
    isVisible,
    position,
  } = req.body;

  const createdlesson = await lessonModel.createLesson(
    lessonTypeId,
    title,
    description,
    shortDesc,
    price,
    depositAmount,
    durationMin,
    maxParticipants,
    level ?? "ALL",
    isVisible ?? 1,
    position ?? 0,
  );

  res.status(201).json({ message: "Lesson created", createdlesson });
});

// get all lessons
export const getAllLessons = asyncHandler(async (req, res) => {
  const lessons = await lessonModel.findAllLessons();
  res.json(lessons);
});

// get lesson by id

export const getLessonById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lesson = await lessonModel.findLessonByID(id);
  if (!lesson) return res.status(404).json({ message: "lesson not found." });

  res.status(200).json(lesson);
});

//update lesson by id

export const updateLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingLesson = await lessonModel.findLessonByID(id);
  if (!existingLesson)
    return res.status(404).json({ message: "lesson not found." });

  const updatedData = {
    lessonTypeId: req.body.lessonTypeId ?? existingLesson.lesson_type_id,
    title: req.body.title ?? existingLesson.title,
    description: req.body.description ?? existingLesson.description,
    shortDesc: req.body.shortDesc ?? existingLesson.short_desc,
    price: req.body.price ?? existingLesson.price,
    depositAmount: req.body.depositAmount ?? existingLesson.deposit_amount,
    durationMin: req.body.durationMin ?? existingLesson.duration_min,
    maxParticipants: req.body.maxParticipants ?? existingLesson.max_participants,
    level: req.body.level ?? existingLesson.level,
    isVisible: req.body.isVisible ?? existingLesson.is_visible,
    position: req.body.position ?? existingLesson.position,
  };

  await lessonModel.updateLesson(id, updatedData);

  res.status(200).json({ message: "lesson updated" });
});

// delete lesson

export const deleteLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingLesson = await lessonModel.findLessonByID(id);

  if (!existingLesson)
    return res.status(404).json({ message: "Lesson not found." });

  await lessonModel.deleteLessonById(id);
  res.status(200).json({ message: "Lesson deleted" });
});
