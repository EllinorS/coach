import express from 'express'
import {createMedia, getAllMedia, getMediaById, updateMediaById, deleteMedia } from '../controllers/media.controller.js'
import {upload} from '../middlewares/upload.middleware.js'
import { createMediaSchema } from '../middlewares/validate.middleware.js'

const router = express.Router()

router.post('/', upload.array('files',10), createMediaSchema, createMedia)
router.get('/', getAllMedia)
router.get('/:id', getMediaById)
router.patch('/:id', updateMediaById, createMediaSchema)
router.delete('/:id', deleteMedia)

export default router

