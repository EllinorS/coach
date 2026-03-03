import { db } from "../config/db.js";

// create booking

export const createBooking = async (
  slotId,
  clientName,
  clientEmail,
  clientPhone,
  clientCountry,
  participants,
  bookingStatus,
  cancelReason,
  notes,
  internalNotes,
  paymentStatus,
) => {
  const [result] = await db.query(
    `INSERT INTO bookings (slot_id, client_name, client_email, client_phone, client_country, participants, status, cancel_reason, notes, internal_notes, payment_status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      slotId,
      clientName,
      clientEmail,
      clientPhone,
      clientCountry,
      participants,
      bookingStatus,
      cancelReason,
      notes,
      internalNotes,
      paymentStatus,
    ],
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

// update booking

export const updateBooking = async (bookingId, data) => {
  const [result] = await db.query(
    `UPDATE bookings SET slot_id=?, client_name=?, client_email=?, client_phone=?, client_country=?, participants=?, status=?, cancel_reason=?, notes=?, internal_notes=?, payment_status=? WHERE id= ?`,
    [
      data.slotId,
      data.clientName,
      data.clientEmail,
      data.clientPhone,
      data.clientCountry,
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
