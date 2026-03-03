import express from 'express'
import {createMedia, getAllMedia, getMediaById, updateMediaById, deleteMedia } from '../controllers/media.controller.js'
import {upload} from '../middlewares/upload.middleware.js'
import { createMediaSchema } from '../middlewares/validate.middleware.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

router.post('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), upload.array('files',10), createMediaSchema, createMedia)
router.get('/', getAllMedia)
router.get('/:id', getMediaById)
router.patch('/:id',  authMiddleware, roleMiddleware("SUPER_ADMIN"),  createMediaSchema, updateMediaById)
router.delete('/:id',  authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteMedia)

export default router

