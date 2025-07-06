/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Formats a date string into DD MMM YYYY format.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return "No due date"
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/**
 * Checks if a date is overdue.
 * @param {string|Date} dueDate
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  const now = new Date()
  const due = new Date(dueDate)
  return due < now && !isToday(due)
}

/**
 * Checks if a date is today.
 * @param {string|Date} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date()
  const d = new Date(date)
  return (
    today.getDate() === d.getDate() &&
    today.getMonth() === d.getMonth() &&
    today.getFullYear() === d.getFullYear()
  )
}
