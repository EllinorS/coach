import { db } from "../config/db.js";

// create media

export const createMedia = async (
  filename,
  url,
  folder,
  mimeType,
  size,
  alt,
  uploadedBy,
) => {
  const [result] = await db.query(
    `INSERT INTO media (filename, url, folder, mime_type, size_bytes, alt, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [filename, url, folder, mimeType, size, alt, uploadedBy],
  );
  return result.insertId;
};

// find all media

export const findAllMedia = async () => {
  const [rows] =
    await db.query(`SELECT media.*, users.first_name, users.last_name FROM media LEFT JOIN users ON users.id = media.uploaded_by ORDER BY media.uploaded_at DESC`);
  return rows;
};

// find media by id

export const findMediaById = async (mediaId) => {
const [rows] = await db.query(`SELECT media.*, users.first_name, users.last_name FROM media LEFT JOIN users ON users.id = media.uploaded_by WHERE media.id =?`, [mediaId])
return rows[0] || null;
};

// update media alt and folder

export const  updateMedia = async (mediaId, data) => {
const [result] = await db.query( ` UPDATE media SET alt=?, folder =? WHERE media.id=?`, [data.alt, data.folder, mediaId])
    return result.affectedRows
}

// delete media

export const deleteMedia = async (mediaId) => {
    const [result] = await db.query(`DELETE FROM media WHERE id =?`, [mediaId])
    return result.affectedRows > 0
}

// connecting table media lesson

    // attach media to a lesson
export const attachMediaToLesson = async ({
  lessonId,
  mediaId,
  isCover = 0,
  position = 0,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO lesson_media (lesson_id, media_id, is_cover, position)
    VALUES (?, ?, ?, ?)
  `,
    [lessonId, mediaId, isCover, position]
  );

  return result.insertId;
};
    // detach media to a lesson
export const detachMediaFromLesson = async (lessonId, mediaId) => {
  const [result] = await db.query(
    `DELETE FROM lesson_media
    WHERE lesson_id = ? AND media_id = ?`,
    [lessonId, mediaId]
  );

  return result.affectedRows;
};



