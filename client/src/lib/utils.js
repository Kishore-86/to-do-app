import { clsx } from "clsx"

/**
 * Combines class names using clsx
 * @param {...any} inputs - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs)
}

/**
 * Formats date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return "No date"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

/**
 * Truncates text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100) {
  if (!text) return ""
  return text.length > length ? `${text.substring(0, length)}...` : text
}