import express from 'express'
import { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking } from '../controllers/booking.controller.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
 import { createBookingSchema } from '../middlewares/validate.middleware.js';

 const router = express.Router()

router.post('/', createBookingSchema, createBooking)
router.get('/', authMiddleware, roleMiddleware("SUPER_ADMIN"),getAllBookings)
router.get('/:id', getBookingById)
router.put('/:id', createBookingSchema, updateBooking)
router.delete('/:id',deleteBooking)
