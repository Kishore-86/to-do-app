const BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper to attach auth headers
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

// =====================
// AUTH
// =====================

// Save user/token after login (called from callback page if needed)
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

// =====================
// TASKS
// =====================

export const getAllTasks = async () => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch tasks")
  return res.json()
}

export const getTaskById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch task")
  return res.json()
}

export const createTask = async (task) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error("Failed to create task")
  return res.json()
}

export const updateTask = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error("Failed to update task")
  return res.json()
}

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete task")
  return res.json()
}

export const markTaskComplete = async (id, isComplete) => {
  const status = isComplete ? "completed" : "in-progress"
  return updateTask(id, { status })
}

// =====================
// SHARED TASKS
// =====================

export const getSharedTasks = async () => {
  const res = await fetch(`${BASE_URL}/api/tasks/shared`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch shared tasks")
  return res.json()
}

export const shareTask = async (id, userIdentifier) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}/share`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ user: userIdentifier }),
  })
  if (!res.ok) throw new Error("Failed to share task")
  return res.json()
}

// =====================
// USER INFO (optional)
// =====================

export const getUserProfile = async () => {
  const res = await fetch(`${BASE_URL}/api/user/me`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch user profile")
  return res.json()
}
