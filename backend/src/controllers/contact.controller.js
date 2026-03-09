import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as contactModel from "../models/contact.model.js";
import {newContactEmail} from "../config/mailer.js"

// create contact

export const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;
  await contactModel.createContact(
    firstName,
    lastName,
    email,
    phone,
    subject,
    message,
  );

  await newContactEmail(firstName, lastName, email, phone, subject, message)

  res.status(201).json({ message: "Message sent." });
});

export const getAllContact = asyncHandler(async (req, res) => {
  const contactMessages = await contactModel.findAllContact();
  res.json(contactMessages);
});

export const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contactMessage = await contactModel.findContactById(id);
  if (!contactMessage)
    return res.status(404).json({ message: "message not found." });
  res.json(contactMessage);
});

export const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contactMessage = await contactModel.findContactById(id);
  if (!contactMessage)
    return res.status(404).json({ message: "message not found." });

  await contactModel.updateContact(id, messageStatus);
  res.status(200).json({ message: "message updated." });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contactMessage = await contactModel.findContactById(id);
  if (!contactMessage)
    return res.status(404).json({ message: "message not found." });
  await contactModel.deleteContactById(id);
  res.status(200).json({ message: "Message deleted." });
});
