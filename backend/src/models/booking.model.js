import { db } from "../config/db.js";

// create booking

export const createBooking = async (
  slotId,
  multipleBookingId,
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
  cancelToken,
  cancelTokenExpiresAt,
) => {
  const [result] = await db.query(
    `INSERT INTO bookings (slot_id, multiple_booking_id, client_name, client_email, client_phone, client_country, participants, status, cancel_reason, notes, internal_notes, payment_status, cancel_token, cancel_token_expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      slotId,
      multipleBookingId,
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
      cancelToken,
      cancelTokenExpiresAt,
    ],
  );
  return result.insertId;
};

// create booking for multiple lessons

export const createMultiple = async (
  email,
  lessonId,
  totalPrice,
  bookingStatus,
) => {
  const [result] = await db.query(
    `INSERT INTO booking_multiple (client_email, lesson_id, total_price, status) VALUES (?, ?, ?,?)`,
    [email, lessonId, totalPrice, bookingStatus],
  );
  return result.insertId;
};

// find all bookings

export const findAllBookings = async () => {
  const [rows] = await db.query(`SELECT * FROM bookings`);
  return rows;
};

//find booking by id

export const findBookingById = async (bookingId) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE id = ?`, [
    bookingId,
  ]);
  return rows[0];
};
// count confirmed bookings by slot id

export const countConfirmedBookingsbySlotId = async (slotId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM bookings WHERE slot_id = ? AND status != 'CANCELLED'`,
    [slotId],
  );
  return rows[0].total;
};

// update booking

export const updateBooking = async (bookingId, data) => {
  const [result] = await db.query(
    `UPDATE bookings SET slot_id=?, client_name=?, client_email=?, client_phone=?, client_country=?, participants=?, status=?, cancel_reason=?, notes=?, internal_notes=?, payment_status=? WHERE id= ?`,
    [
      data.slotId,
      data.clientName,
      data.email,
      data.phone,
      data.country,
      data.participants,
      data.bookingStatus,
      data.cancelReason,
      data.notes,
      data.internalNotes,
      data.paymentStatus,
      bookingId,
    ],
  );
  return result.affectedRows;
};

// delete booking

export const deleteBookingById = async (bookingId) => {
  const [result] = await db.query(`DELETE FROM bookings WHERE id=?`, [
    bookingId,
  ]);
  return result.affectedRows;
};

// option for client to cancel their booking

export const findBookingByCancelToken = async (token) => {
  const [rows] = await db.query(
    `SELECT bookings.*,
    time_slots.date, 
    time_slots.start_time, 
    time_slots.end_time,
    lesson_types.name AS lesson_type
    FROM bookings 
    JOIN time_slots ON bookings.slot_id = time_slots.id
    JOIN lessons ON time_slots.lesson_id = lessons.id
    JOIN lesson_types ON lessons.lesson_type_id = lesson_types.id
    WHERE bookings.cancel_token =? AND bookings.cancel_token_expires_at > NOW() `,
    [token],
  );
  return rows[0];
};

export const cancelBooking = async (bookingId) => {
  await db.query(
    `UPDATE bookings SET status='CANCELLED' , cancel_token=NULL, internal_notes='Client cancelled - offer alternative slot'  WHERE id =? `,
    [bookingId],
  );
};
