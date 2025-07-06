import express from "express"
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  shareTask,
} from "../controllers/taskController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Protect all task routes
router.use(protect)

// GET all user and shared tasks
router.get("/", getTasks)

// POST create a new task
router.post("/", createTask)

// GET a specific task by ID
router.get("/:id", getTaskById)

// PUT update a task
router.put("/:id", updateTask)

// DELETE a task
router.delete("/:id", deleteTask)

// POST share a task with another user (via email)
router.post("/:id/share", shareTask)

export default router
