export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id)

    // Join room for each user ID (owner or shared)
    socket.on("join", (userId) => {
      socket.join(userId)
      console.log(`📥 Socket ${socket.id} joined room ${userId}`)
    })

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id)
    })
  })
}
