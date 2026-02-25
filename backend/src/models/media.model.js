import { db } from "../config/db.js";

export const createMedia = async (filename, url, folder, mimeType, size, uploadedBy) => {
    const [result] = await db.query(`INSERT INTO media (filename, url, folder, mime_type, size_bytes, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`, [filename, url, folder, mimeType, size, uploadedBy])
    return result.insertId
}