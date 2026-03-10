import { cancellationEmail } from "../config/mailer.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as slotModel from "../models/slot.model.js";

// create slot
export const createSlot = asyncHandler(async (req, res) => {
  const {
    lessonId,
    date,
    startTime,
    endTime,
    spotsTotal,
    isCancelled,
    cancelReason,
    notes,
  } = req.body;

  const createdSlot = await slotModel.createSlot(
    lessonId,
    date,
    startTime,
    endTime,
    spotsTotal,
    isCancelled ?? 0,
    cancelReason,
    notes,
  );

  res.status(201).json({ message: "Slot created", createdSlot });
});

// get all slots
export const getAllSlots = asyncHandler(async (req, res) => {
  const slots = await slotModel.findAllSlots();
  res.json(slots);
});

// get slots by id
export const getSlotsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slot = await slotModel.findSlotById(id);
  if (!slot) return res.status(404).json({ message: "Slot not found." });
  res.json(slot);
});

// get slots by lesson id

export const getSlotsByLessonId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slots = await slotModel.findSlotsByLessonId(id);
  if (!slots) return res.status(404).json({ message: "Slots not found." });
  res.json(slots);
});


//update slot

export const updateSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingSlot = await slotModel.findSlotById(id);
  if (!existingSlot)
    return res.status(404).json({ message: "Slot not found." });

  const updatedData = {
    LessonId: req.body.lessonId ?? existingSlot.lesson_id,
    date: req.body.date ?? existingSlot.date,
    startTime: req.body.startTime ?? existingSlot.start_time,
    endTime: req.body.endTime ?? existingSlot.end_time,
    spotsTotal: req.body.spotsTotal ?? existingSlot.spots_total,
    isCancelled: req.body.isCancelled ?? existingSlot.is_cancelled,
    cancelReason: req.body.cancelReason ?? existingSlot.cancel_reason,
    notes: req.body.notes ?? existingSlot.notes,
  };

  await slotModel.updateSlot(id, updatedData);

  res.status(200).json({ message: "slot updated" });
});

// cancel slot 

export const cancelSlot = asyncHandler(async(req,res) => {
  const {id} = req.params
  const {cancelReason} = req.body

  const existingSlot = await slotModel.findSlotById(id);
if (!existingSlot) return res.status(404).json({ message: "Slot not found." })
if (existingSlot.is_cancelled) return res.status(400).json({ message: "Slot already cancelled." })

  const clients = await slotModel.findBookingsBySlotId(id)
  await slotModel.cancelSlotAndBooking(id, cancelReason)
  
  for (const client of clients) {
  await cancellationEmail(
    client.client_email,
    client.client_name,
    existingSlot.lesson_type,
    existingSlot.date,
    existingSlot.start_time,
    cancelReason,
    client.payment_status
  )
  }

res.status(200).json({ message: "Slot cancelled and clients notified." })

})

// delete slot

export const deleteSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingSlot = await slotModel.findSlotById(id);

  if (!existingSlot)
    return res.status(404).json({ message: "Slot not found." });

  await slotModel.deleteSlotById(id)
    res.status(200).json({ message: "Slot deleted" });
});

