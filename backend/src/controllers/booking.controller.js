import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as bookingModel from "../models/booking.model.js";
import {
  bookingConfirmationEmail,
  multipleBookingConfirmationEmail,
} from "../config/mailer.js";
import { v4 as uuid4 } from "uuid";
import * as slotModel from "../models/slot.model.js";
import * as lessonModel from "../models/lesson.model.js";

//create booking

export const createBooking = asyncHandler(async (req, res) => {
  const {
    slotId,
    clientName,
    email,
    phone,
    country,
    nbParticipants,
    bookingStatus,
    cancelReason,
    notes,
    internalNotes,
    paymentStatus,
  } = req.body;

  // verify slot existance
  const slot = await slotModel.findSlotById(slotId);

  if (!slot) return res.status(404).json({ message: "Slot not found." });

  if (slot.is_cancelled)
    return res.status(400).json({ message: "Slot is cancelled." });

  // create a cancel token for clients to be able to cancel 24h prior to booking

  const cancelToken = uuid4();
  const slotDateTime = new Date(`${slot.date}T${slot.start_time}`);
  const cancelTokenExpiresAt = new Date(
    slotDateTime.getTime() - 24 * 60 * 60 * 1000,
  );

  // verify available spots

  const confirmedBookings =
    await bookingModel.countConfirmedBookingsbySlotId(slotId);

  if (confirmedBookings >= slot.spots_total)
    return res.status(400).json({ message: "Slot is full." });

  await bookingModel.createBooking(
    slotId,
    null,
    clientName,
    email,
    phone,
    country ?? null,
    nbParticipants ?? 1,
    bookingStatus ?? "PENDING",
    cancelReason ?? null,
    notes ?? null,
    internalNotes ?? null,
    paymentStatus ?? "UNPAID",
    cancelToken,
    cancelTokenExpiresAt,
  );
  await bookingConfirmationEmail(
    clientName,
    email,
    slot.lesson_type,
    slot.date,
    slot.start_time,
    slot.end_time,
    cancelToken,
  );
  res.status(201).json({ message: "Booking confirmed" });
});

// create multiple bookings

export const createMultipleBookings = asyncHandler(async (req, res) => {
  const {
    lessonId,
    slotIds,
    clientName,
    email,
    phone,
    country,
    nbParticipants,
  } = req.body;

  // verify existing, and validity of lesson
  const lesson = await lessonModel.findLessonByID(lessonId);
  if (!lesson) return res.status(404).json({ message: "Lesson not found." });
  if (lesson.type !== "MULTIPLE")
    return res.status(400).json({
      message: "This lesson can't be booked with a multiple sessions package.",
    });
  if (!lesson.linked_lesson_id)
    return res
      .status(400)
      .json({ message: "This lesson has no linked group lesson." });
  if (slotIds.length !== lesson.sessions_count)
    return res.status(400).json({
      message: `You must select ${lesson.sessions_count} slots.`,
    });

  // avoid double bookings
  const duplicates = slotIds.some(
    (slotId, index) => slotIds.indexOf(slotId) !== index,
  );
  if (duplicates)
    return res
      .status(400)
      .json({ message: "You cannot book the same slot twice." });

  // verify each slot and store them
  const slots = [];
  for (const slotId of slotIds) {
    const slot = await slotModel.findSlotById(slotId);
    if (!slot)
      return res.status(404).json({ message: `Slot ${slotId} not found.` });
    if (slot.lesson_id !== lesson.linked_lesson_id)
      return res
        .status(400)
        .json({ message: "This slot is not available for this camp." });
    if (slot.is_cancelled)
      return res.status(400).json({ message: `Slot ${slotId} is cancelled.` });
    const confirmedBookings =
      await bookingModel.countConfirmedBookingsbySlotId(slotId);
    if (confirmedBookings >= slot.spots_total)
      return res.status(400).json({ message: `Slot ${slotId} is full.` });
    slots.push(slot);
  }

  // create multiple
  const multipleId = await bookingModel.createMultiple(
    email,
    lessonId,
    lesson.price,
  );

  // create one booking per slot
  const cancelTokens = [];
  for (const slot of slots) {
    const cancelToken = uuid4();
    const slotDateTime = new Date(`${slot.date}T${slot.start_time}`);
    const cancelTokenExpiresAt = new Date(
      slotDateTime.getTime() - 24 * 60 * 60 * 1000,
    );
    cancelTokens.push(cancelToken);
    await bookingModel.createBooking(
      slot.id,
      multipleId,
      clientName,
      email,
      phone,
      country ?? null,
      nbParticipants ?? 1,
      "PENDING",
      null,
      null,
      null,
      "UNPAID",
      cancelToken,
      cancelTokenExpiresAt,
    );
  }

  // send confirmation email with all slots
  await multipleBookingConfirmationEmail(
    clientName,
    email,
    slots,
    cancelTokens,
  );

  res.status(201).json({ message: "Bookings confirmed" });
});

// get all bookings

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingModel.findAllBookings();
  res.json(bookings);
});

// get bookings by id

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await bookingModel.findBookingById(id);
  if (!booking) return res.status(404).json({ message: "booking not found." });
  res.status(200).json(booking);
});

// update booking

export const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingBooking = await bookingModel.findBookingById(id);
  if (!existingBooking)
    return res.status(404).json({ message: "booking not found." });

  const updatedData = {
    slotId: req.body.slotId ?? existingBooking.slot_id,
    clientName: req.body.clientName ?? existingBooking.client_name,
    email: req.body.email ?? existingBooking.client_email,
    phone: req.body.phone ?? existingBooking.client_phone,
    country: req.body.country ?? existingBooking.client_country,
    nbParticipants: req.body.nbParticipants ?? existingBooking.participants,
    bookingStatus: req.body.bookingStatus ?? existingBooking.status,
    cancelReason: req.body.cancelReason ?? existingBooking.cancel_reason,
    notes: req.body.notes ?? existingBooking.notes,
    internalNotes: req.body.internalNotes ?? existingBooking.internal_notes,
    paymentStatus: req.body.paymentStatus ?? existingBooking.payment_status,
  };

  await bookingModel.updateBooking(id, updatedData);
  res.status(200).json({ message: "booking updated" });
});

// delete booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingBooking = await bookingModel.findBookingById(id);

  if (!existingBooking)
    return res.status(404).json({ message: "Booking not found." });

  await bookingModel.deleteBookingById(id);
  res.status(200).json({ message: "Booking deleted" });
});

// cancel booking
export const cancelBookingByToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const booking = await bookingModel.findBookingByCancelToken(token);
  if (!booking) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  await bookingModel.cancelBooking(booking.id);
  res.status(200).json({ message: "Booking cancelled." });
});

// preview booking before cancel

export const previewBooking = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const booking = await bookingModel.findBookingByCancelToken(token);
  if (!booking) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
  res.status(200).json(booking);
});
