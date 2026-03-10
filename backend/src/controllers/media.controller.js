import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as mediaModel from "../models/media.model.js";
import fs from "fs";
import path from "path";

// create media
export const createMedia = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No file provided" });
  }

  const { folder, alt, lessonId } = req.body;
  const uploadedBy = req.user?.id || null;
  const mediaArray = [];

  for (const file of req.files) {
    const filename = file.filename;
    const url = `/uploads/${file.filename}`;
    const mimeType = file.mimetype;
    const size = file.size;

    const createdMedia = await mediaModel.createMedia(
      filename,
      url,
      folder || null,
      mimeType,
      size,
      alt || null,
      uploadedBy,
    );

    if (lessonId) {
      await mediaModel.attachMediaToLesson({
        lessonId: Number(lessonId),
        mediaId: createdMedia,
        isCover: 0,
        position: mediaArray.length,
      });
    }
    mediaArray.push(createdMedia);
  }
  res
    .status(201)
    .json({ message: `${mediaArray.length} file(s) uploaded`, mediaArray });
});

// get all media
export const getAllMedia = asyncHandler(async (req, res) => {
  const media = await mediaModel.findAllMedia();
  res.status(200).json(media);
});

// get media by id

export const getMediaById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exisitingMedia = await mediaModel.findMediaById(id);
  if (!exisitingMedia)
    return res.status(404).json({ message: "Media not found" });
  res.status(200).json(exisitingMedia);
});

// update media by id

export const updateMediaById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingMedia = await mediaModel.findMediaById(id);
  if (!existingMedia)
    return res.status(404).json({ message: "Media not found" });

  const updatedData = {
    alt: req.body.alt ?? existingMedia.alt,
    folder: req.body.folder ?? existingMedia.folder,
  };

  await mediaModel.updateMedia(id, updatedData);

  res.status(200).json({ message: "media updated" });
});

// delete media
export const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingMedia = await mediaModel.findMediaById(id);
  if (!existingMedia)
    return res.status(404).json({ message: "Media not found" });

  // delete physical media
  const filePath = path.resolve("uploads", existingMedia.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  // delete from db
  await mediaModel.deleteMedia(id);
  res.status(200).json({ message: "Media deleted" });
});

// link media to lesson
export const linkMediaToLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const { mediaId, isCover, position } = req.body;

  await mediaModel.linkMediaToLesson({
    lessonId,
    mediaId,
    isCover: isCover ?? 0,
    position: position ?? 0,
  });
  res.status(201).json({ message: "Media attached to lesson" })
});

//unlink media
export const unlinkMedia = asyncHandler(async (req, res) => {
  const { lessonId } = req.params
  const { mediaId } = req.body
  await mediaModel.detachMediaFromLesson(lessonId, mediaId)
  res.status(200).json({ message: "Media detached from lesson" })
})
