import Task from '../models/Task.js';
import User from '../models/User.js'

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, sharedWith } = req.body
  const task = await Task.create({
    title, description, dueDate, priority,
    owner: req.user._id,
    sharedWith,
  })
  req.io.to(req.user._id.toString()).emit("task:created", task)
  res.status(201).json(task)
}

// Get all tasks for a user (owned or shared)
export const getTasks = async (req, res) => {
  const { status, priority, due } = req.query
  let filter = {
    $or: [
      { owner: req.user._id },
      { sharedWith: req.user._id }
    ]
  }
  if (status) filter.status = status
  if (priority) filter.priority = priority
  // Add more filters as needed
  const tasks = await Task.find(filter).sort({ dueDate: 1 })
  res.json(tasks)
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
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ message: "Task not found" })
  if (!task.owner.equals(req.user._id) && !task.sharedWith.includes(req.user._id))
    return res.status(403).json({ message: "Forbidden" })
  Object.assign(task, req.body)
  await task.save()
  req.io.to(task.owner.toString()).emit("task:updated", task)
  task.sharedWith.forEach(uid => req.io.to(uid.toString()).emit("task:updated", task))
  res.json(task)
}

// Delete task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ message: "Task not found" })
  if (!task.owner.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" })
  await task.deleteOne()
  req.io.to(task.owner.toString()).emit("task:deleted", task._id)
  task.sharedWith.forEach(uid => req.io.to(uid.toString()).emit("task:deleted", task._id))
  res.json({ message: "Deleted" })
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
