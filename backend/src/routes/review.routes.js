import express from "express";
import { createReview, getAllReviews, getReviewById, updateReview, deleteReview, getVisibleReviews } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createReviewsSchema } from "../middlewares/validate.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

router.post("/", authMiddleware, roleMiddleware("SUPER_ADMIN"), createReviewsSchema, createReview)
router.get("/", authMiddleware, roleMiddleware("SUPER_ADMIN"), getAllReviews)
router.get("/public", getVisibleReviews)
router.get("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), getReviewById)
router.put("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), updateReview)
router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), deleteReview)

export default router
