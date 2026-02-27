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
  const mediaIds = [];

  for (const file of req.files) {
    const filename = file.filename;
    const url = `/uploads/${file.filename}`;
    const mimeType = file.mimetype;
    const size = file.size;

    const mediaId = await mediaModel.createMedia(
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
        mediaId,
        isCover: 0,
        position: mediaIds.length,
      });
    }

    mediaIds.push(mediaId);
  }

  res
    .status(201)
    .json({ message: `${mediaIds.length} file(s) uploaded`, mediaIds });
});

// get all media
export const getAllMedia = asyncHandler(async (req, res) => {
  const media = await mediaModel.findAllMedia();
  res.status(200).json(media);
});

// get media by id

export const getMediaById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const media = await mediaModel.findMediaById(id);
  if (!media) return res.status(404).json({ message: "Media not found" });
  res.status(200).json(media);
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

  res.status(200).json({message: "media updated"});
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
