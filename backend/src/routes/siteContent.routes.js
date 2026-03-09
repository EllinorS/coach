import express from "express";
import { getAllContent, getContentByKey, getContentByPage, updateContentByKey } from "../controllers/siteContent.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createContentSchema } from "../middlewares/validate.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

router.get('/', getAllContent)
router.get('/page/:pageName', getContentByPage)
router.get('/key/:keyName', getContentByKey)
router.put('/key/:keyName', authMiddleware, roleMiddleware("SUPER_ADMIN"), createContentSchema, updateContentByKey)

export default router