import { db } from "../config/db.js";

//create lesson

export const createLesson = async (
  lessonTypeId,
  title,
  description,
  shortDesc,
  price,
  depositAmount,
  durationMin,
  maxParticipants,
  level,
  isVisible,
  position,
) => {
  const [result] = await db.query(
    `INSERT INTO lessons (lesson_type_id, title, description, short_desc,  price, deposit_amount, duration_minutes, max_participants, level, is_visible, position) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      lessonTypeId,
      title,
      description,
      shortDesc,
      price,
      depositAmount,
      durationMin,
      maxParticipants,
      level,
      isVisible,
      position,
    ],
  );
  return result.insertId;
};

// find all lessons
export const findAllLessons = async () => {
  const [rows] = await db.query(`SELECT * FROM lessons`);
  return rows;
};

// find lesson by id

export const findLessonByID = async (lessonId) => {
  const [rows] = await db.query(`SELECT * FROM lessons WHERE id = ?`, [
    lessonId,
  ]);
  return rows[0];
};

// update lesson

export const updateLesson = async (lessonId, data) => {
  const [result] = await db.query(
    `UPDATE lessons SET lesson_type_id = ?, title = ?, description = ?, short_desc = ?,  price = ?, deposit_amount = ?, duration_minutes = ?, max_participants = ?, level = ?, is_visible = ?, position =? WHERE id=?`[
      (data.lessonTypeId,
      data.title,
      data.description,
      data.shortDesc,
      data.price,
      data.depositAmount,
      data.durationMin,
      data.maxParticipants,
      data.level,
      data.isVisible,
      data.position,
      lessonId)
    ],
  );
  return result.affectedRows;
};

// delete lesson

export const deleteLessonById = async (lessonId) => {
  const [result] = await db.query(`DELETE FROM lessons WHERE id=?`, [lessonId]);
  return result.affectedRows;
};
