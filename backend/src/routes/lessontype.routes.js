import express from "express";

import { createLessonType, getAllLessonType, getLessonTypeById, updateLessonType, deleteLessonType } from "../controllers/lessonType.controller.js";


import { authMiddleware } from "../middlewares/auth.middleware.js";

import { createLessonTypeSchema} from "../middlewares/validate.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

router.post('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), createLessonTypeSchema,createLessonType)
router.get('/', getAllLessonType)
router.get('/:id', getLessonTypeById)
router.patch('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), updateLessonType)
router.delete('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteLessonType)

export default router;
