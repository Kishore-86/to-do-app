// Basic AI-like prioritizer based on keywords and urgency

export const aiPrioritize = (task) => {
  const title = task.title?.toLowerCase() || ""
  const description = task.description?.toLowerCase() || ""

  // Assign default
  let priority = "medium"

  const now = new Date()
  const due = task.dueDate ? new Date(task.dueDate) : null

  // 🔥 Urgent if due in next 24 hours
  const isUrgent = due && (due - now) / (1000 * 60 * 60) <= 24

  // ⚠️ High priority keywords
  const highKeywords = ["urgent", "asap", "immediate", "important", "deadline"]
  const lowKeywords = ["optional", "later", "someday", "if possible"]

  const text = `${title} ${description}`

  const hasHigh = highKeywords.some((word) => text.includes(word))
  const hasLow = lowKeywords.some((word) => text.includes(word))

  if (isUrgent || hasHigh) {
    priority = "high"
  } else if (hasLow) {
    priority = "low"
  }

  return priority
}
