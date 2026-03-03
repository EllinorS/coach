import { db } from "../config/db.js";

// create lesson type

export const createLessonType = async (name, slug, description, isActive, position) => {
    const [result] = await db.query(`INSERT INTO lesson_types (name, slug, description, is_active, position) VALUES (?,?,?,?,? )`, [name, slug, description, isActive, position])
    return result.insertId
}
// find all lesson types
export const findAllLessonTypes = async() =>{
    const [rows] = await db.query(`SELECT * FROM lesson_types`)
    return rows
}
// find lesson type by id
export const findLessonTypeByID = async (lessonId) => {
const [rows] = await db.query(`SELECT * FROM lesson_types WHERE id = ?`, [lessonId])
return rows[0]
}

//update lesson type

export const updateLessonType = async (lessonId, data) => {
    const [result] = await db.query(`UPDATE lesson_types SET name = ?, slug=?, description=?, is_active = ?, position = ? WHERE id = ?`, [data.name, data.slug, data.description, data.isActive, data.position, lessonId])

    return result.affectedRows
}


// delete lesson type
export const deleteLessonTypeById = async (lessonId) => {
    const [result] = await db.query(`DELETE FROM lesson_types WHERE id=?`, [lessonId])
    return result.affectedRows
}

