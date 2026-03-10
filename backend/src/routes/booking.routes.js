import express from 'express'
import { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, cancelBookingByToken, previewBooking, createMultipleBookings } from '../controllers/booking.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createBookingSchema, createMultipleBookingSchema } from '../middlewares/validate.middleware.js';


const router = express.Router()

router.post('/', createBookingSchema, createBooking)
router.post('/multiple', createMultipleBookingSchema, createMultipleBookings)
router.get('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), getAllBookings)
router.get('/cancel/preview', previewBooking)
router.post('/cancel', cancelBookingByToken)
router.get('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), getBookingById)
router.put('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), updateBooking)
router.delete('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteBooking)

export default router