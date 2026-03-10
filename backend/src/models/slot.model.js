import { db } from "../config/db.js";

//create time slot
export const createSlot = async (
  LessonId,
  date,
  startTime,
  endTime,
  spotsTotal,
  isCancelled,
  cancelReason,
  notes,
) => {
  const [result] = await db.query(
    `INSERT INTO time_slots (lesson_id, date, start_time, end_time, spots_total, is_cancelled, cancel_reason, notes) VALUES(?,?,?,?,?,?,?,?)`,
    [
      LessonId,
      date,
      startTime,
      endTime,
      spotsTotal,
      isCancelled,
      cancelReason,
      notes,
    ],
  );
  return result.insertId;
};

// find time slot
export const findAllSlots = async () => {
  const [rows] = await db.query(`SELECT * FROM time_slots`);
  return rows;
};

// find time slot by id
export const findSlotById = async (slotId) => {
  const [rows] = await db.query(
    `SELECT time_slots.*, lessons.title, lesson_types.name AS lesson_type FROM time_slots 
    JOIN lessons ON lessons.id = time_slots.lesson_id 
    JOIN lesson_types ON lesson_types.id = lessons.lesson_type_id
  WHERE time_slots.id = ?`,
    [slotId],
  );
  return rows[0];
};

// find slots by lesson id

export const findSlotsByLessonId = async (lessonId) => {
  const [rows] = await db.query(
    `SELECT * FROM time_slots WHERE lesson_id = ?`,
    [lessonId],
  );
  return rows;
};

// find clients by slot id
 export const findBookingsBySlotId = async (slotId) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE slot_id = ? AND status!='CANCELLED'`, [slotId])
return rows 
}

// update slot

export const updateSlot = async (slotId, data) => {
  const [result] = await db.query(
    `UPDATE time_slots SET lesson_id = ?, date = ?, start_time = ?, end_time = ?, spots_total = ?, is_cancelled = ?, cancel_reason = ?, notes = ? WHERE id= ?`,
    [
      data.LessonId,
      data.date,
      data.startTime,
      data.endTime,
      data.spotsTotal,
      data.isCancelled,
      data.cancelReason,
      data.notes,
      slotId,
    ],
  );
  return result.affectedRows;
};

// cancel time slot + booking

export const cancelSlotAndBooking = async (slotId, cancelReason) => {
  await db.query(`UPDATE time_slots SET is_cancelled = 1, cancel_reason = ? WHERE id=?`, [cancelReason, slotId])
  await db.query(`UPDATE bookings SET status ='CANCELLED', cancel_reason = ? WHERE slot_id = ? AND status !='CANCELLED'`, [cancelReason, slotId])
}

// delete slot
export const deleteSlotById = async (slotId) => {
  const [result] = await db.query(`DELETE FROM time_slots WHERE id=?`, [
    slotId,
  ]);
  return result.affectedRows;
};
