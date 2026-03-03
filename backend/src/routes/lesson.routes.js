import express from 'express'
import { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson } from '../controllers/lesson.controller'
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
