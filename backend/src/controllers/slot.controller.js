import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as slotModel from "../models/slot.model.js";

// create slot
export const createSlot = asyncHandler(async (req, res) => {
  const {
    LessonId,
    date,
    startTime,
    endTime,
    spotsTotal,
    isCancelled,
    cancelReason,
    notes,
  } = req.body;

  const createdSlot = await slotModel.createSlot(
    LessonId,
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

// get slots by lessonn id

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

// delete slot

export const deleteSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingSlot = await slotModel.findSlotById(id);

  if (!existingSlot)
    return res.status(404).json({ message: "Slot not found." });

  await slotModel.deleteSlotById(id)
    res.status(200).json({ message: "Slot deleted" });
});