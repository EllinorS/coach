import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as lessonTypeModel from "../models/lessonType.model.js";

// create lesson type

export const createLessonType = asyncHandler(async (req, res) => {
  const { name, slug, description, isActive, position } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is mandatory" });
  }
  if (!slug) {
    return res.status(400).json({ message: "Slug is mandatory" });
  }

  const createdLessonType = await lessonTypeModel.createLessonType(
    name,
    slug,
    description || null,
    isActive ?? 1,
    position ?? 0,
  );

  res.status(201).json({ message: "Lesson type created", createdLessonType });
});

// get all lesson types
export const getAllLessonType = asyncHandler(async (req, res) => {
  const lessonTypes = await lessonTypeModel.findAllLessonTypes();
  res.json(lessonTypes);
});

// get lesson type by id
export const getLessonTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lessonType = await lessonTypeModel.findLessonTypeByID(id);
  if (!lessonType)
    return res.status(404).json({ message: "Lesson type not found." });
  res.status(200).json(lessonType);
});

// update lesson type by id
export const updateLessonType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingLessonType = await lessonTypeModel.findLessonTypeByID(id);
  if (!existingLessonType)
    return res.status(404).json({ message: "Lesson type not found." });
  
  const updatedData = {
    name: req.body.name ?? existingLessonType.name,
    slug: req.body.slug ?? existingLessonType.slug, 
    description: req.body.description ?? existingLessonType.description, 
    isActive: req.body.isActive ?? existingLessonType.is_active, 
    position: req.body.position ?? existingLessonType.position
  }

  await lessonTypeModel.updateLessonType(id, updatedData)

    res.status(200).json({ message: "lesson type updated" });
});

// delete lesson type by id
export const deleteLessonType = asyncHandler(async (req, res) => {
  const {id} = req.params
  const existingLessonType = await lessonTypeModel.findLessonTypeByID(id);
  if (!existingLessonType)
    return res.status(404).json({ message: "Lesson type not found." });
  await lessonTypeModel.deleteLessonTypeById(id)

  res.status(200).json({ message: "Lesson Type deleted" });

});
