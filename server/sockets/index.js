export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id)

    // Join room for each user ID (owner or shared)
    socket.on("join", (userId) => {
      socket.join(userId)
      console.log(`📥 Socket ${socket.id} joined room ${userId}`)
    })

    // Task created or updated → notify shared users
    socket.on("task-updated", ({ task, sharedWith }) => {
      const recipients = [...sharedWith, task.owner]

      recipients.forEach((userId) => {
        io.to(userId).emit("refresh-tasks", task)
      })

      console.log("🔄 Task update broadcasted")
    })

    // Task deleted
    socket.on("task-deleted", ({ taskId, sharedWith, owner }) => {
      const recipients = [...sharedWith, owner]

      recipients.forEach((userId) => {
        io.to(userId).emit("remove-task", taskId)
      })

      console.log("❌ Task deletion broadcasted")
    })

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id)
    })
  })
}
