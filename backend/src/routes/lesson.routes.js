import express from 'express'
import { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson } from '../controllers/lesson.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
 import { createLessonSchema } from '../middlewares/validate.middleware.js';

 const router = express.Router()

 router.post('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), createLessonSchema, createLesson)
 router.get('/', getAllLessons)
 router.get('/:id', getLessonById)
 router.put('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), createLessonSchema, updateLesson )

router.delete('/:id',  authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteLesson)

export default router