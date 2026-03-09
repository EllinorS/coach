import express from 'express'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createContactSchema, updateContactSchema } from '../middlewares/validate.middleware.js';
import { createContact, getAllContact,getContactById,updateContact,deleteContact } from '../controllers/contact.controller.js';

const router = express.Router()

router.post('/', createContactSchema, createContact)
router.get('/', authMiddleware, roleMiddleware("SUPER_ADMIN"), getAllContact)
router.get('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"),getContactById)
router.patch('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), updateContactSchema, updateContact)
router.delete('/:id', authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteContact)


export default router