import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import passport from "passport"
import session from "express-session"
import mongoose from "mongoose"
import { createServer } from "http"
import { Server } from "socket.io"

// Load env variables
dotenv.config()

// Internal modules
import connectDB from "./config/db.js"
import { configurePassport } from "./config/passport.js"
import { initSocket } from "./sockets/index.js"
import { apiLimiter } from "./middleware/rateLimiter.js"

// Routes
import taskRoutes from "./routes/taskRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"

// Connect to MongoDB
connectDB()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})

// Initialize Socket.IO logic
initSocket(io)

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(apiLimiter)

// Session (needed for Passport OAuth2)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())
configurePassport(passport)

// API Routes
app.use("/api/tasks", taskRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

// Health check
app.get("/", (req, res) => {
  res.send("✅ CyberTask API is running...")
})

// Start Server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
