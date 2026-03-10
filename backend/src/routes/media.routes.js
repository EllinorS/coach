import express from 'express'
import {createMedia, getAllMedia, getMediaById, updateMediaById, deleteMedia, linkMediaToLesson, unlinkMedia } from '../controllers/media.controller.js'
import {upload} from '../middlewares/upload.middleware.js'
import { createMediaSchema } from '../middlewares/validate.middleware.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {  } from '../controllers/media.controller.js';

const router = express.Router()

router.post('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), upload.array('files',10), createMediaSchema, createMedia)
router.get('/', getAllMedia)
router.get('/:id', getMediaById)
router.put('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), createMediaSchema, updateMediaById)
router.delete('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteMedia)
router.post('/:lessonId/link', authMiddleware, roleMiddleware("SUPER_ADMIN"), linkMediaToLesson)
router.delete('/:lessonId/unlink', authMiddleware, roleMiddleware("SUPER_ADMIN"), unlinkMedia)

export default router

