import { io } from "socket.io-client"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

let socket

export const initSocket = () => {
  const token = localStorage.getItem("token")

  socket = io(BASE_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
    reconnection: true,
  })

  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket.id)
  })

  socket.on("disconnect", () => {
    console.warn("❌ Disconnected from socket")
  })

  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket connection error:", err.message)
  })
}

export const getSocket = () => socket
