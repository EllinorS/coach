import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as bookingModel from "../models/booking.model.js";
import { bookingConfirmationEmail } from "../config/mailer.js";
import { v4 as uuid4 } from "uuid";
import * as slotModel from "../models/slot.model.js";

//create booking

export const createBooking = asyncHandler(async (req, res) => {
  const {
    slotId,
    clientName,
    clientEmail,
    clientPhone,
    clientCountry,
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

  // cancel token for client to be able to cancel 24h prior to booking
  
  const cancelToken = uuid4();
  const slotDateTime = new Date (`${slot.date}T${slot.start_time}`)
  const cancelTokenExpiresAt = new Date(slotDateTime.getTime() - 24 * 60 * 60 * 1000);

  // verify available spots

  const confirmedBookings =
    await bookingModel.countConfirmedBookingsbySlotId(slotId);

  if (confirmedBookings >= slot.spots_total)
    return res.status(400).json({ message: "Slot is full." });

  await bookingModel.createBooking(
    slotId,
    clientName,
    clientEmail,
    clientPhone,
    clientCountry ?? null,
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
    clientEmail,
    slot.lesson_type,
    slot.date,
    slot.start_time,
    slot.end_time,
  );
  res.status(201).json({ message: "Booking confirmed" });
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
    clientEmail: req.body.clientEmail ?? existingBooking.client_email,
    clientPhone: req.body.clientPhone ?? existingBooking.client_phone,
    clientCountry: req.body.clientCountry ?? existingBooking.client_country,
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

export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingBooking = await bookingModel.findBookingById(id);

  if (!existingBooking)
    return res.status(404).json({ message: "Booking not found." });

  await bookingModel.deleteBookingById(id);
  res.status(200).json({ message: "Booking deleted" });
});
