import { db } from "../config/db.js";

// create contact

export const createContact = async (
firstName, lastName, email, phone, subject, message
) => {
    const [result] = await db.query("INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) VALUES (?,?,?,?,?,?,?)",[firstName, lastName, email, phone, subject, message])

    return result.insertId;
}


export const findAllContact = async (

) => {
    const [rows] = await db.query("SELECT * FROM contact_messages")

    return rows
}

export const findContactById = async (contactId) => {
    const [rows] = await db.query("SELECT * FROM contact_messages WHERE id = ?", [contactId])
    return rows[0]
}

export const updateContact = async (
contactId, status
) => {
    const [result] = await db.query("UPDATE contact_messages SET status = ? WHERE id =?",[status, contactId])

  return result.affectedRows;
}

export const deleteContactById = async (contactId) => {
    const [result] = await db.query("DELETE FROM contact_messages WHERE id=?",[contactId])

  return result.affectedRows;
}