import express from "express"
import {
  getUserProfile,
  updateXP,
  findUserByEmail,
} from "../controllers/userController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Apply JWT auth middleware to all routes
router.use(protect)

// @route   GET /api/user/profile
router.get("/profile", getUserProfile)

// @route   PATCH /api/user/xp
router.patch("/xp", updateXP)

// @route   POST /api/user/find
router.post("/find", findUserByEmail)

export default router
