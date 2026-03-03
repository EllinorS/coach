import express from 'express'
import { createSlot, getAllSlots, getSlotsById, updateSlot, deleteSlot, getSlotsByLessonId} from '../controllers/slot.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
 import { createSlotSchema } from '../middlewares/validate.middleware.js';

 const router = express.Router()

 router.post('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), createSlotSchema, createSlot)
 router.get('/', getAllSlots)
 router.get('/', getSlotsById)
 router.get('/:id', getSlotsByLessonId)
 router.put('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), createSlotSchema, updateSlot)
 router.delete('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteSlot)
