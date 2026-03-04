import { db } from "../config/db.js";

// create booking

export const createBooking = async (
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
  cancelToken
) => {
  const [result] = await db.query(
    `INSERT INTO bookings (slot_id, client_name, client_email, client_phone, client_country, participants, status, cancel_reason, notes, internal_notes, payment_status, cancel_token) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
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
      cancelToken
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
// count confirmed bookings by slot id

export const countConfirmedBookingsbySlotId = async (slotId) => {
  const [rows] = await db.query(
`SELECT COUNT(*) AS total FROM bookings WHERE slot_id = ? AND status != 'CANCELLED'`, [slotId]
  )
  return rows[0].total
}

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


// option for client to cancel their booking

export const findBookingByCancelToken = async (token) => {
  const [rows] = await db.query(`SELECT * FROM bookings WHERE cancel_token =? AND cancel_token_expires_at > NOW() `, [token])
  return rows[0]
}

export const cancelBooking = async (bookingId) => {
  await db.query(`UPDATE bookings SET status='CANCELLED' , cancel_token=NULL WHERE id =? `,[bookingId])
}