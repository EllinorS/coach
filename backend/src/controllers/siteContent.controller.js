import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as contentModel from "../models/siteContent.model.js";

// get all content

export const getAllContent = asyncHandler(async (req, res) => {
  const content = await contentModel.findAllContent();
  res.json(content);
});

// get content by page
export const getContentByPage = asyncHandler(async (req, res) => {
  const { pageName } = req.params;
  const content = await contentModel.findContentByPage(pageName);
  if (!content.length)
    return res.status(404).json({ message: "Page not found." });
  res.status(200).json(content);
});

// get content by key
export const getContentByKey = asyncHandler(async (req, res) => {
  const { keyName } = req.params;
  const content = await contentModel.findContentByKey(keyName);
  if (!content) return res.status(404).json({ message: "content not found." });
  res.json(content);
});
// update content by key

export const updateContentByKey = asyncHandler(async (req, res) => {
  const { keyName } = req.params;
  const existingKey = await contentModel.findContentByKey(keyName);
  if (!existingKey) return res.status(404).json({ message: "Key not found." });
  const {value, mediaId} = req.body
    
  await contentModel.updateContentByKey(keyName, value ?? existingKey.value, mediaId ?? existingKey.media_id)
  res.status(200).json({ message: "Content updated" })
});
