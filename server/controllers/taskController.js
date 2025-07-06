import Task from "../models/taskModel.js"
import User from "../models/userModel.js"

// Create a new task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user.id })
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message })
  }
}

// Get all tasks for a user (owned or shared)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id },
      ],
    }).sort({ createdAt: -1 })

    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message })
  }
}

// Get a single task
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ message: "Task not found" })

    // Check permission
    if (
      task.owner.toString() !== req.user.id &&
      !task.sharedWith.includes(req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized to view this task" })
    }

    res.status(200).json(task)
  } catch (err) {
    res.status(500).json({ message: "Failed to get task", error: err.message })
  }
}

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to update this task" })

    Object.assign(task, req.body)
    const updated = await task.save()

    res.status(200).json(updated)
  } catch (err) {
    res.status(400).json({ message: "Failed to update task", error: err.message })
  }
}

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ message: "Task not found" })
    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this task" })

    await task.deleteOne()
    res.status(200).json({ message: "Task deleted" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message })
  }
}

// Share task with another user
export const shareTask = async (req, res) => {
  try {
    const { email } = req.body
    const task = await Task.findById(req.params.id)
    const userToShare = await User.findOne({ email })

    if (!task || !userToShare)
      return res.status(404).json({ message: "Task or user not found" })

    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Only owner can share the task" })

    if (!task.sharedWith.includes(userToShare._id)) {
      task.sharedWith.push(userToShare._id)
      await task.save()
    }

    res.status(200).json({ message: `Task shared with ${email}` })
  } catch (err) {
    res.status(500).json({ message: "Failed to share task", error: err.message })
  }
}
